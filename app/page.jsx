'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/FIREBASE/config';

export default function Home() {
  const router = useRouter();
  const initialCategories = ['Fruits', 'Vegetables', 'Dairy', 'Grains', 'Snacks'];
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState('');
  const [items, setItems] = useState({});
  const [search, setSearch] = useState('');

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setItems({ ...items, [newCategory]: [] });
      setNewCategory('');
    }
  };

  const deleteCategory = (category) => {
    setCategories(categories.filter(cat => cat !== category));
    const updatedItems = { ...items };
    delete updatedItems[category];
    setItems(updatedItems);
  };

  const addItem = (category, itemName, expirationDate) => {
    const newItems = [...(items[category] || []), { name: itemName, expirationDate }];
    setItems({ ...items, [category]: newItems });
  };

  const deleteItem = (category, itemName) => {
    const updatedItems = items[category].filter(item => item.name !== itemName);
    setItems({ ...items, [category]: updatedItems });
  };

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gray-900 text-white">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Pantry Tracker</h1>
        <p className="text-xl mb-8">Easily manage your pantry with categorized items and expiration dates.</p>
        <button 
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold"
          onClick={() => {
            signOut(auth);
            sessionStorage.removeItem('user');
            router.push('/sign-in');
          }}
        >
          Log out
        </button>
      </div>

      <div className="w-full max-w-5xl mb-8">
        <input 
          type="text" 
          placeholder="Search categories" 
          className="border p-2 rounded w-full text-gray-900 mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {filteredCategories.map(category => (
          <div key={category} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">{category}</h2>
              <button 
                className="text-red-500 hover:text-red-700"
                onClick={() => deleteCategory(category)}
              >
                Delete
              </button>
            </div>
            <div className="mb-4">
              <input 
                type="text" 
                placeholder="Item name" 
                className="border p-2 rounded mb-2 w-full text-gray-900" 
                id={`itemName-${category}`}
              />
              <input 
                type="date" 
                className="border p-2 rounded mb-2 w-full text-gray-900" 
                id={`expirationDate-${category}`}
              />
              <button 
                className="w-full bg-blue-500 text-white py-2 rounded"
                onClick={() => {
                  const itemName = document.getElementById(`itemName-${category}`).value;
                  const expirationDate = document.getElementById(`expirationDate-${category}`).value;
                  addItem(category, itemName, expirationDate);
                }}
              >
                Add Item
              </button>
            </div>
            <ul>
              {items[category]?.map(item => (
                <li key={item.name} className="flex justify-between items-center mb-2">
                  <span>{item.name} (Exp: {item.expirationDate})</span>
                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteItem(category, item.name)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Add New Category</h2>
          <input 
            type="text" 
            placeholder="Category name" 
            className="border p-2 rounded mb-4 w-full text-gray-900"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button 
            className="w-full bg-green-500 text-white py-2 rounded"
            onClick={addCategory}
          >
            Add Category
          </button>
        </div>
      </div>
    </main>
  );
}
