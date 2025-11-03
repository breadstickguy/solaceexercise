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
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>Searching for: {searchTerm}</p>
        <input
          style={{ border: "1px solid black" }}
          value={searchTerm}
          onChange={onChange}
        />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            {/*
              Generate table headers from COLUMNS configuration
            */}
            {COLUMNS.map((col) => (
              <th scope="col" key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate, index) => {
            /**
             * Use advocate.id as the key if available (from database)
             * Fall back to index for mock data without IDs
             */
            const rowKey = advocate.id ?? `advocate-${index}`;

            return (
              <tr key={rowKey}>
                {/*
                  Generate table cells dynamically from COLUMNS configuration
                */}
                {COLUMNS.map((col) => {
                  const value = advocate[col.key];

                  return (
                    <td key={col.key}>
                      {Array.isArray(value) ? (
                        value.map((item, idx) => (
                          <div key={`${rowKey}-${col.key}-${idx}`}>{item}</div>
                        ))
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
    </main>
  );
}
