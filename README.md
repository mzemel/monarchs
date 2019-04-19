# About

This project attempts to create timelines of the monarchies of major European powers over the last millenia.

I'd like to have an easy visual reference for who was concurrently in power and what events were going on in the world.

In version 2, I'd like to have a way of relating the monarchs to each other via family, marriage, etc.

## Workflow

1. Keep data in [Google Spreadsheet](https://docs.google.com/spreadsheets/d/1gn-62AWtt5o4PnbMgzs6VUlbykweki1MGnm5nee7zTM/edit?usp=sharing)
2. Export it to `dataset.json` with [Google Add-On](https://chrome.google.com/webstore/detail/export-sheet-data/bfdcopkbamihhchdnjghdknibmcnfplk?hl=en)

## To do

- Compile and enter all data
- Cursor tracks year as it moves
- Radio button to select active country; inactive countries have more opacity / less detail
- Wars as rects above monarchy timeline
- World event timeline
  - Dots at the bottom, on hover show a paragraph
  - Links up with beginning and end of timelines (e.g. "monarchy of Italy abolished")
  - Tagged with science, monarchy, philosophy, etc, and display as different icons on the timeline
  - On hover, straight line to top of page that allows you to trace which monarchs are in power at the time
- Deploy to monarchy.thebackend.dev
- Details SVG is only the size of the rectangle
- Navigation arrows on detail
- Hyperlinks to events, wars, etc.
- Replace contemporary paintings with revisionist ones
- Font size adjust: given width and height, let font be whatever it wants to fit itself (proportionally) to those dimensions
