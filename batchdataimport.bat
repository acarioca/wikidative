@echo off
cd ".\revisions"
for %%f in (*.json) do (
    "mongoimport.exe" --jsonArray --db wikidata --collection revisions --file "%%f"
)
pause