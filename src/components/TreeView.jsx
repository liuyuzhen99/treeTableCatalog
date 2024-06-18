// src/components/TreeView.js
import React, { useState, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import './TreeView.css';

const ItemTypes = {
  TREE_ITEM: 'treeItem',
};

const TreeItem = ({ item, moveItem, findItem, parentId, setItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const originalIndex = findItem(item.id).index;

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TREE_ITEM,
    item: { id: item.id, originalIndex, parentId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.TREE_ITEM,
    hover({ id: draggedId }) {
      if (draggedId !== item.id && item.children && !isOpen) {
        setIsOpen(true);
      }
    },
    drop({ id: draggedId, parentId: draggedParentId }) {
      if (draggedId !== item.id) {
        moveItem(draggedId, item.id, draggedParentId, parentId);
      }
    },
  });

  const opacity = isDragging ? 0.5 : 1;

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity }}>
      <div className="tree-item" onClick={handleToggle}>
        {item.children && (
          <span className="tree-icon">
            {isOpen ? <FaChevronDown /> : <FaChevronRight />}
          </span>
        )}
        <span className="tree-title">{item.title}</span>
      </div>
      {isOpen && item.children && (
        <div className="tree-children">
          {item.children.map((child, index) => (
            <TreeItem
              key={index}
              item={child}
              moveItem={moveItem}
              findItem={findItem}
              parentId={item.id}
              setItems={setItems}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TreeView = ({ items, setItems }) => {
  const moveItem = useCallback((draggedId, targetId, fromParentId, toParentId) => {
    const { item: draggedItem, parentId: currentParentId } = findItem(draggedId);
    const { item: targetItem, index: targetIndex } = findItem(targetId);

    if (draggedId !== targetId) {
      let updatedItems = JSON.parse(JSON.stringify(items)); // 深拷贝，防止状态变异

      const removeItem = (arr, id) => arr.filter(i => i.id !== id);

      if (fromParentId || currentParentId) {
        const fromParent = findItem(fromParentId || currentParentId).item;
        fromParent.children = removeItem(fromParent.children, draggedId);
      } else {
        updatedItems = removeItem(updatedItems, draggedId);
      }

      if (toParentId) {
        const toParent = findItem(toParentId).item;
        toParent.children = toParent.children || [];
        toParent.children.splice(targetIndex, 0, draggedItem);
      } else {
        updatedItems.splice(targetIndex, 0, draggedItem);
      }

      setItems(updatedItems);
    }
  }, [items, setItems]);

  const findItem = useCallback((id) => {
    let item;
    let index;
    let parentId = null;

    const searchItems = (items, parent = null) => {
      items.some((i, idx) => {
        if (i.id === id) {
          item = i;
          index = idx;
          parentId = parent;
          return true;
        }
        if (i.children) {
          return searchItems(i.children, i.id);
        }
        return false;
      });
    };

    searchItems(items);
    return { item, index, parentId };
  }, [items]);

  return (
    <div className="tree-view">
      {items.map((item, index) => (
        <TreeItem
          key={index}
          item={item}
          moveItem={moveItem}
          findItem={findItem}
          setItems={setItems}
        />
      ))}
    </div>
  );
};

export default TreeView;
