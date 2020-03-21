const data = [
  {
    id: "3",
    name: "Coding",
    persons: 2,
    begin: "3/11/2010",
    end: "3/18/2010",
    progress: 80,
    state: "open"
  },
  {
    id: "5",
    name: "Coding",
    persons: 2,
    begin: "3/11/2010",
    end: "3/18/2010",
    progress: 80,
    state: "open",
    children: [
      {
        id: "5-1",
        name: "Coding",
        persons: 2,
        begin: "3/11/2010",
        end: "3/18/2010",
        progress: 80,
        state: "open"
      },
      {
        id: "5-2",
        name: "Coding",
        persons: 2,
        begin: "3/11/2010",
        end: "3/18/2010",
        progress: 80,
        state: "open",
        children: [
          {
            id: "5-2-1",
            name: "Coding",
            persons: 2,
            begin: "3/11/2010",
            end: "3/18/2010",
            progress: 80,
            state: "open"
          }
        ]
      }
    ]
  },
  {
    id: "1",
    name: "All Tasks",
    begin: "3/4/2010",
    end: "3/20/2010",
    progress: 60,
    iconCls: "icon-ok",
    children: [
      {
        id: "1-1",
        name: "Designing",
        begin: "3/4/2010",
        end: "3/10/2010",
        progress: 100,
        _parentId: 1,
        state: "closed",
        children: [
          {
            id: 21,
            name: "Database",
            persons: 2,
            begin: "3/4/2010",
            end: "3/6/2010",
            progress: 100,
            _parentId: 2,
            state: "open"
          },
          {
            id: 22,
            name: "UML",
            persons: 1,
            begin: "3/7/2010",
            end: "3/8/2010",
            progress: 100,
            _parentId: 2,
            state: "open"
          },
          {
            id: 23,
            name: "Export Document",
            persons: 1,
            begin: "3/9/2010",
            end: "3/10/2010",
            progress: 100,
            _parentId: 2,
            state: "open"
          }
        ]
      },
      {
        id: "1-2",
        name: "Designing",
        begin: "3/4/2010",
        end: "3/10/2010",
        progress: 100,
        _parentId: 1,
        state: "closed",
        children: [
          {
            id: "1-2-21",
            name: "Database",
            persons: 2,
            begin: "3/4/2010",
            end: "3/6/2010",
            progress: 100,
            _parentId: 2,
            state: "open"
          },
          {
            id: "1-2-22",
            name: "UML",
            persons: 1,
            begin: "3/7/2010",
            end: "3/8/2010",
            progress: 100,
            _parentId: 2,
            state: "open",
            children: [
              {
                id: "1-2-22-1",
                name: "Database",
                persons: 2,
                begin: "3/4/2010",
                end: "3/6/2010",
                progress: 100,
                _parentId: 2,
                state: "open"
              }
            ]
          }
        ]
      }
    ],
    state: "open"
  },
  {
    id: "4",
    name: "Coding",
    persons: 2,
    begin: "3/11/2010",
    end: "3/18/2010",
    progress: 80,
    state: "open"
  }
];

export default data;
