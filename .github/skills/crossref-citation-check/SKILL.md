---
name: crossref-citation-check
description: >-
  Validate bibliography information (authors, title, journal, volume, issue,
  pages, URL, DOI, and related metadata) of scholarly articles using
  Crossref's REST API. Use this skill when the user asks to verify or
  correct citations: it compares provided references against Crossref's
  authoritative metadata and reports discrepancies.
argument-hint: >-
  Path to a citations file (JSON or CSV) or a structured list of
  citation objects (JSON array). Each citation should include at least a
  title or DOI; other fields (authors, journal, volume, issue, pages,
  year, URL) are optional but recommended.
user-invokable: true
---

# Crossref Citation Check Skill

## Purpose

This skill provides a clear, repeatable workflow for verifying citation
metadata against the Crossref REST API. It helps detect missing or
incorrect fields (authors, title, journal, volume, issue, pages, year,
URL, DOI) and suggests corrections based on Crossref's records.

## When to use this skill

- The user provides a list of references and asks if they are complete or
  accurate.
- You need to check that a citation's DOI and other metadata match the
  published record.
- The user wants to identify discrepancies between their citation list
  and Crossref's authoritative metadata.

## Steps to follow

1. **Collect input**: Ask the user to supply a file path or a structured
   list (JSON or CSV) containing citations. Each citation should include
   at minimum a title or DOI. Optionally include authors, journal name,
   volume, issue, pages, year, DOI and URL.

2. **Retrieve metadata**:
   - If a DOI is provided, query Crossref at
     `https://api.crossref.org/works/<doi>` to fetch authoritative metadata.
   - If no DOI is provided, search by title using
     `https://api.crossref.org/works?query.bibliographic=<title>&rows=1`
     and treat the first result as the best candidate. If the top match
     looks unrelated, request clearer input from the user.

3. **Compare fields**:
   - **Title**: Compare the provided title to Crossref's title(s),
     ignoring differences in case and common punctuation. Prefer the
     primary title returned by Crossref.
   - **Authors**: Normalize author names (trim, lowercase, remove
     punctuation) and compare as unordered sets of full names; report
     missing or extra authors.
   - **Journal**: Compare the provided journal name to Crossref's
     `container-title` (allow common abbreviations to be flagged but not
     treated as exact matches).
   - **Volume, Issue, Pages, Year, URL, DOI**: Compare values directly
     with Crossref fields (`volume`, `issue`, `page`, `published` date
     parts, `URL`, `DOI`). For `date-parts`, use the first element as the
     year.

4. **Report results**:
   - For each citation, indicate whether each field matches Crossref's
     metadata. Clearly highlight discrepancies and any missing fields.
   - Return results in a structured format (JSON recommended) containing
     the provided value, Crossref value, and a match status for each
     field.

5. **Follow up**:
   - If entries match, inform the user the citation appears accurate.
   - If discrepancies exist, provide suggested corrections and the
     authoritative Crossref values.
   - If Crossref has no likely match, ask the user for additional
     details (full title, DOI, or author names) and suggest manual
     verification strategies.

## Example input format

Here is an example of a citation list in JSON format that the user might
provide:

```json
[
  {
    "title": "Deep Learning Applications in Genomics",
    "authors": ["Alice Smith", "Bob Jones"],
    "journal": "Bioinformatics Research",
    "volume": "10",
    "issue": "2",
    "pages": "123-130",
    "year": "2025",
    "doi": "10.1000/example.doi",
    "url": "https://doi.org/10.1000/example.doi"
  },
  {
    "title": "Neural Networks for Data Analysis",
    "authors": ["Carol Lee"],
    "journal": null,
    "volume": null,
    "issue": null,
    "pages": null,
    "year": null,
    "doi": null,
    "url": null
  }
]
```

In the first entry, a DOI is provided, so the skill should query
Crossref by DOI and compare the returned metadata. In the second entry,
no DOI is provided, so the skill should search by title and compare
against the closest match.

## Notes

- This skill assumes the Crossref REST API is reachable. If the API is
  unreachable, inform the user and suggest retrying later.
- Include a polite `User-Agent` header with a contact email in API
  requests, for example: `CitationChecker/1.0 (mailto:your.email@example.com)`.
- Rate limits and polite usage: insert brief delays (for example, 1 second)
  between requests for bulk checks, and avoid high-frequency polling.
- When interpreting Crossref `date-parts`, use the first element as the
  year (for example, `"published-print": {"date-parts": [[2024, 5, 1]]}` ->
  year 2024).

## Optional script

For convenience, this directory includes a helper script,
`crossref_checker.py`, which automates the querying and comparison
steps described above. See the script's docstring and usage examples
for invocation details (for example, `python crossref_checker.py -i citations.json`).
