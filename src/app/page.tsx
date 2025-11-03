"use client";

import { useEffect, useState } from "react";

/**
 * Advocate type definition matching the database schema
 * This ensures type safety when working with advocate data
 */
type Advocate = {
  id?: number; // mock data may not have IDs
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  createdAt?: Date;
};

/**
 * Column configuration for the advocates table
 * 1. Source of truth
 * 2. Easily reorder columns
 * 3. Easy to add/remove columns
 * 4. Type-safe column keys
 */
type ColumnConfig = {
  key: keyof Advocate;
  label: string;
};

const COLUMNS: ColumnConfig[] = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "city", label: "City" },
  { key: "degree", label: "Degree" },
  { key: "specialties", label: "Specialties" },
  { key: "yearsOfExperience", label: "Years of Experience" },
  { key: "phoneNumber", label: "Phone Number" },
];

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        console.log("fetching advocates...");
        const response = await fetch("/api/advocates");
        const jsonResponse = await response.json();
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      } catch (error) {
        console.error("Failed to fetch advocates:", error);
      }
    };

    fetchAdvocates();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      const lowerSearchTerm = value.toLowerCase();

      return (
        advocate.firstName.toLowerCase().includes(lowerSearchTerm) ||
        advocate.lastName.toLowerCase().includes(lowerSearchTerm) ||
        advocate.city.toLowerCase().includes(lowerSearchTerm) ||
        advocate.degree.toLowerCase().includes(lowerSearchTerm) ||
        advocate.specialties.some((specialty) =>
          specialty.toLowerCase().includes(lowerSearchTerm)
        ) ||
        advocate.yearsOfExperience.toString().includes(value)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Solace Advocates
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
            Search Advocates
          </label>
          <div className="flex gap-3">
            <input
              id="search-input"
              type="text"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Search by name, city, degree, or specialty..."
              value={searchTerm}
              onChange={onChange}
            />
            <button
              onClick={onClick}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition shadow-sm"
            >
              Reset
            </button>
          </div>
          {searchTerm && (
            <p className="mt-3 text-sm text-gray-600">
              Searching for: <span className="font-semibold text-gray-800">{searchTerm}</span>
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {/*
              Generate table headers from COLUMNS configuration
            */}
            {COLUMNS.map((col) => (
              <th
                scope="col"
                key={col.key}
                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredAdvocates.map((advocate, index) => {
            /**
             * Use advocate.id as the key if available (from database)
             * Fall back to index for mock data without IDs
             */
            const rowKey = advocate.id ?? `advocate-${index}`;

            return (
              <tr key={rowKey} className="hover:bg-gray-50 transition">
                {/*
                  Generate table cells dynamically from COLUMNS configuration
                */}
                {COLUMNS.map((col) => {
                  const value = advocate[col.key];

                  return (
                    <td key={col.key} className="px-6 py-4 text-sm text-gray-900">
                      {Array.isArray(value) ? (
                        <div className="flex flex-wrap gap-1">
                          {value.map((item, idx) => (
                            <span
                              key={`${rowKey}-${col.key}-${idx}`}
                              className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : value instanceof Date ? (
                        value.toLocaleString()
                      ) : (
                        value
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
        </div>
      </div>
    </main>
  );
}
