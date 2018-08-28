" au FileType project
syn match progFile "\v\S+\.js"
hi link progFile Statement

syn match testFile "\v.*\.test\.js( |$)"
hi link testFile Identifier


syn match commentLine "#.*"
hi link commentLine NonText

