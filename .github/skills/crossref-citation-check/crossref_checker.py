"""
crossref_checker.py
====================

This module provides a simple command‑line tool and Python API for validating
bibliographic information about scholarly articles using Crossref's free
REST API. It is designed to help authors, librarians and developers verify
that a given citation is complete and accurate by comparing the supplied
metadata against authoritative data returned by Crossref.

Key features:

* Query Crossref by DOI (preferred) or by title when a DOI is unavailable.
* Retrieve essential metadata fields such as title, authors, journal name,
  volume, issue, pages, publication year, DOI and URL.
* Compare supplied values to Crossref's response and flag discrepancies.
* Accept input in JSON or CSV format, making it easy to integrate into
  existing workflows. CSV files should have column headers matching the
  metadata keys (e.g. ``title``, ``authors``, ``journal``, ``volume``);
  multiple authors should be separated by semicolons.
* Optional polite ``User‑Agent`` header via a ``--email`` flag to comply
  with Crossref's etiquette recommendations.

Example usage:

.. code-block:: bash

   # Validate citations stored in citations.json and print the report
   python crossref_checker.py --input citations.json

   # Validate citations from a CSV file and save the report to results.json
   python crossref_checker.py -i citations.csv -o results.json -e you@example.com

In both cases, the script outputs a list of results. Each result contains
the original article data and either a ``comparison`` dictionary of
matching flags or an ``error`` message if the API returned no match.

Note: The Crossref API enforces rate limits. This script includes a
small delay between requests to avoid hitting those limits. For large
datasets, consider caching results or requesting a polite rate limit
increase from Crossref.

"""

from __future__ import annotations

import argparse
import json
import time
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

import requests


@dataclass
class Article:
    """Representation of a bibliographic record provided by the user.

    The ``authors`` attribute should be a list of strings (e.g. ``["John Doe", "Jane Smith"]``).
    Other attributes are optional and may be ``None`` if unknown.
    """

    title: Optional[str] = None
    authors: Optional[List[str]] = field(default_factory=list)
    journal: Optional[str] = None
    volume: Optional[str] = None
    issue: Optional[str] = None
    pages: Optional[str] = None
    year: Optional[str] = None
    doi: Optional[str] = None
    url: Optional[str] = None


class CrossrefChecker:
    """A client for validating article metadata against the Crossref REST API."""

    BASE_URL = "https://api.crossref.org/works"

    def __init__(self, email: Optional[str] = None) -> None:
        """Initialise the Crossref checker.

        Parameters
        ----------
        email : str, optional
            Contact email to include in the User‑Agent header. Supplying
            a contact address is considered good practice and may improve
            the reliability of requests.
        """
        user_agent = "CrossrefCitationChecker/1.0"
        if email:
            user_agent = f"{user_agent} (mailto:{email})"
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": user_agent})

    def get_metadata(self, doi: Optional[str] = None, title: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Retrieve bibliographic metadata from Crossref by DOI or title.

        When a DOI is supplied, the API is queried directly via ``/works/{doi}``.
        Otherwise, a title search is performed using the ``query.bibliographic``
        parameter, returning the first match.

        Parameters
        ----------
        doi : str, optional
            Digital Object Identifier for the article.
        title : str, optional
            The article title to search for. Only used when ``doi`` is ``None``.

        Returns
        -------
        dict or None
            A dictionary containing Crossref metadata for the article, or
            ``None`` if no match is found or an error occurs.
        """
        try:
            if doi:
                # Normalise DOI by stripping whitespace
                doi = doi.strip()
                url = f"{self.BASE_URL}/{doi}"
                response = self.session.get(url, timeout=30)
                response.raise_for_status()
                data = response.json()
                return data.get("message")
            elif title:
                params = {"query.bibliographic": title, "rows": 1}
                response = self.session.get(self.BASE_URL, params=params, timeout=30)
                response.raise_for_status()
                data = response.json()
                items = data.get("message", {}).get("items", [])
                return items[0] if items else None
            else:
                raise ValueError("Either DOI or title must be provided to fetch metadata.")
        except requests.RequestException:
            return None

    @staticmethod
    def _normalise_str(value: Optional[str]) -> Optional[str]:
        """Normalise a string for comparison by stripping whitespace and lowering case."""
        if value is None:
            return None
        return value.strip().lower()

    def compare(self, provided: Article, crossref: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
        """Compare user‑provided article metadata against Crossref's record.

        The comparison attempts to match various fields (title, authors, journal,
        volume, issue, pages, year, DOI, and URL). Each entry in the returned
        dictionary contains the provided value, the Crossref value, and a
        boolean ``match`` flag indicating whether they are equal (case‑insensitive
        for strings).

        Parameters
        ----------
        provided : Article
            The citation supplied by the user.
        crossref : dict
            The metadata retrieved from Crossref for the article.

        Returns
        -------
        dict
            A nested dictionary keyed by field name. Each value has the
            structure ``{"provided": <user value>, "crossref": <api value>, "match": bool}``.
        """
        result: Dict[str, Dict[str, Any]] = {}

        def record(field: str, provided_value: Any, crossref_value: Any, normalise: bool = True) -> None:
            """Helper to populate the result dictionary for a single field."""
            if normalise and isinstance(provided_value, str) and isinstance(crossref_value, str):
                pv = self._normalise_str(provided_value)
                cv = self._normalise_str(crossref_value)
                match = (pv == cv) if pv is not None and cv is not None else False
            else:
                match = provided_value == crossref_value
            result[field] = {
                "provided": provided_value,
                "crossref": crossref_value,
                "match": match,
            }

        # Title comparison (Crossref returns a list of titles)
        crossref_title = None
        crossref_titles = crossref.get("title")
        if isinstance(crossref_titles, list) and crossref_titles:
            crossref_title = crossref_titles[0]
        elif isinstance(crossref_titles, str):
            crossref_title = crossref_titles
        record("title", provided.title, crossref_title)

        # Journal name (container-title may be a list)
        crossref_journal = None
        ctitle = crossref.get("container-title")
        if isinstance(ctitle, list) and ctitle:
            crossref_journal = ctitle[0]
        elif isinstance(ctitle, str):
            crossref_journal = ctitle
        record("journal", provided.journal, crossref_journal)

        # Authors: compare as sets of lowercase strings for order‑independent matching
        provided_authors = provided.authors or []
        provided_set = {self._normalise_str(a) for a in provided_authors if a}
        crossref_authors_data = crossref.get("author") or []
        crossref_names: List[str] = []
        for author in crossref_authors_data:
            given = (author.get("given") or "").strip()
            family = (author.get("family") or "").strip()
            full_name = f"{given} {family}".strip()
            if full_name:
                crossref_names.append(full_name)
        crossref_set = {self._normalise_str(n) for n in crossref_names if n}
        # Determine match (True only if sets are identical and non‑empty)
        authors_match = bool(provided_set) and provided_set == crossref_set
        result["authors"] = {
            "provided": provided_authors,
            "crossref": crossref_names,
            "match": authors_match,
        }

        # Volume, issue, pages
        record("volume", provided.volume, crossref.get("volume"), normalise=False)
        record("issue", provided.issue, crossref.get("issue"), normalise=False)
        # Crossref uses 'page' for pages
        record("pages", provided.pages, crossref.get("page"))

        # Publication year: attempt to extract from 'published-print' or 'published-online'
        crossref_year: Optional[str] = None
        for date_field in ("published-print", "published-online", "published"):
            if date_field in crossref:
                date_parts = crossref[date_field].get("date-parts")
                if isinstance(date_parts, list) and date_parts and date_parts[0]:
                    # date-parts is a list of lists: [[year, month, day]]
                    crossref_year = str(date_parts[0][0])
                    break
        record("year", provided.year, crossref_year, normalise=False)

        # DOI and URL (case‑insensitive for DOI; URL will also be compared case‑insensitively as a string)
        record("doi", provided.doi, crossref.get("DOI"))
        record("url", provided.url, crossref.get("URL"))

        return result

    def check_articles(self, articles: List[Article]) -> List[Dict[str, Any]]:
        """Validate a list of articles against Crossref and return comparison results.

        Parameters
        ----------
        articles : list of Article
            Articles to be validated. At least ``title`` or ``doi`` should be provided for each article.

        Returns
        -------
        list of dict
            Each entry contains the original article data and either a ``comparison`` dict or
            an ``error`` message if no metadata could be retrieved from Crossref.
        """
        results: List[Dict[str, Any]] = []
        for article in articles:
            meta: Optional[Dict[str, Any]] = None
            # Prefer DOI lookup when available
            if article.doi:
                meta = self.get_metadata(doi=article.doi)
            # Fallback to title search if DOI is missing or the DOI lookup returned nothing
            if not meta and article.title:
                meta = self.get_metadata(title=article.title)
            if meta:
                comparison = self.compare(article, meta)
                results.append({"article": article.__dict__, "comparison": comparison})
            else:
                results.append({"article": article.__dict__, "error": "No match found"})
            # Respect Crossref rate limits: a short delay between requests
            time.sleep(1)
        return results


def load_articles_from_json(path: str) -> List[Article]:
    """Load a list of articles from a JSON file.

    The file should contain a JSON array where each element is an object with
    keys corresponding to the Article fields (e.g. ``"title"``, ``"authors"``, ``"journal"``, etc.).

    Parameters
    ----------
    path : str
        Path to the JSON file.

    Returns
    -------
    list of Article
        A list of ``Article`` instances.
    """
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    articles: List[Article] = []
    for entry in data:
        # Ensure authors is a list
        authors = entry.get("authors")
        if isinstance(authors, str):
            # Split comma or semicolon separated strings
            authors_list = [a.strip() for a in authors.replace(";", ",").split(",") if a.strip()]
        elif isinstance(authors, list):
            authors_list = authors
        else:
            authors_list = []
        articles.append(
            Article(
                title=entry.get("title"),
                authors=authors_list,
                journal=entry.get("journal"),
                volume=entry.get("volume"),
                issue=entry.get("issue"),
                pages=entry.get("pages"),
                year=str(entry.get("year")) if entry.get("year") is not None else None,
                doi=entry.get("doi"),
                url=entry.get("url"),
            )
        )
    return articles


def load_articles_from_csv(path: str) -> List[Article]:
    """Load a list of articles from a CSV file.

    The CSV must contain a header row with field names matching the Article
    attributes. Authors should be separated by semicolons (``;``) or commas.

    Parameters
    ----------
    path : str
        Path to the CSV file.

    Returns
    -------
    list of Article
        A list of ``Article`` instances.
    """
    import csv
    articles: List[Article] = []
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            authors_raw = row.get("authors") or ""
            # Replace semicolons with commas to unify splitting, then split
            authors_list = [a.strip() for a in authors_raw.replace(";", ",").split(",") if a.strip()]
            articles.append(
                Article(
                    title=row.get("title"),
                    authors=authors_list,
                    journal=row.get("journal"),
                    volume=row.get("volume"),
                    issue=row.get("issue"),
                    pages=row.get("pages"),
                    year=row.get("year"),
                    doi=row.get("doi"),
                    url=row.get("url"),
                )
            )
    return articles


def main() -> None:
    """Entry point for the command‑line interface."""
    parser = argparse.ArgumentParser(
        description="Validate a list of scholarly citations using Crossref's REST API."
    )
    parser.add_argument(
        "-i", "--input", required=True, help="Path to a JSON or CSV file containing article records"
    )
    parser.add_argument(
        "-o", "--output", help="Path to write the results JSON report"
    )
    parser.add_argument(
        "-e",
        "--email",
        help=(
            "Contact email to include in the User‑Agent header. "
            "Providing an email is recommended for polite API usage."
        ),
    )
    args = parser.parse_args()

    # Load articles from the specified input file
    ext = args.input.split(".")[-1].lower()
    if ext == "json":
        articles = load_articles_from_json(args.input)
    elif ext == "csv":
        articles = load_articles_from_csv(args.input)
    else:
        raise ValueError(
            f"Unsupported input format: {ext}. Use a .json or .csv file."
        )

    checker = CrossrefChecker(email=args.email)
    results = checker.check_articles(articles)

    # Write or print the results
    if args.output:
        with open(args.output, "w", encoding="utf-8") as out:
            json.dump(results, out, indent=2, ensure_ascii=False)
    else:
        print(json.dumps(results, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()