// src/App.js
import React, { useState } from 'react';
import TreeView from './components/TreeView';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';

const initialItems = [
  {
    id: 'section1',
    title: 'Section 1',
    children: [
      { id: 'subsection1-1', title: 'Subsection 1.1' },
      { id: 'subsection1-2', title: 'Subsection 1.2' },
    ],
  },
  {
    id: 'section2',
    title: 'Section 2',
    children: [
      {
        id: 'subsection2-1',
        title: 'Subsection 2.1',
        children: [
          { id: 'subsubsection2-1-1', title: 'Subsubsection 2.1.1' },
        ],
      },
    ],
  },
  { id: 'section3', title: 'Section 3' },
  // 可以继续添加更多的目录项
];

function App() {
  const [items, setItems] = useState(initialItems);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <TreeView items={items} setItems={setItems}/>
      </div>
    </DndProvider>
  );
}

export default App;
