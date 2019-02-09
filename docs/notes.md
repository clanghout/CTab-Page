Subgrids with Muuri
===================

Problem statement:

- Grid controls used to have columns and rows (i.e. coordinates) to which items could be pinned.

- Muuri has no pre defined columns and rows, instead it uses an ordering function and auto resizes items to the available space.

- Current options for ordering are on the name (savedata: 'title') of the items and on the date added (savedata: 'id')

- Add a way of ordering ("folder like") to grids

Steps
-----

1. Split settings
2.


Additional things we like to add:
---------------------------------

**Before sub grids:**

- Saving correctly

Current example:
```
[

    {"title":"sic","settings":{"autoPosition":false,"x":4,"y":0,"width":2,"height":1},"contentUrl":"https://github.com/foresterre/sic","color":"#000e8a","textcolor":"#ffffff","type":"link","id":8},
]
```

Specifically has:

- title (str)                   ->required
- settings (map):
    - autoPosition (bool)
    - x (num)                   ; unused?
    - y (num)                   ; unused?
    - width (num)
    - height (num)
    - contentUrl
    - color                     ;
    - textcolor
    - type
    - id (num, incr)
    - city                      ; for weather widget


What we perhaps want is separate customizations for each widget.


**Undetermined:**

- Firefox addon support (works already in developer mode), i.e. packaging
-