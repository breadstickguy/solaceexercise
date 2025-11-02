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

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;

    document.getElementById("search-term").innerHTML = searchTerm;

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(searchTerm) ||
        advocate.lastName.includes(searchTerm) ||
        advocate.city.includes(searchTerm) ||
        advocate.degree.includes(searchTerm) ||
        advocate.specialties.includes(searchTerm) ||
        advocate.yearsOfExperience.includes(searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input style={{ border: "1px solid black" }} onChange={onChange} />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            {/*
              Generate table headers from COLUMNS configuration
              This keeps headers in sync with the data columns below
            */}
            {COLUMNS.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate, index) => {
            /**
             * Use advocate.id as the key if available (from database)
             * Fall back to index for mock data without IDs
             * Keys help React efficiently update the DOM when the list changes
             */
            const rowKey = advocate.id ?? `advocate-${index}`;

            return (
              <tr key={rowKey}>
                {/*
                  Generate table cells dynamically from COLUMNS configuration
                  This eliminates repetitive code and keeps data in sync with headers
                */}
                {COLUMNS.map((col) => {
                  const value = advocate[col.key];

                  return (
                    <td key={col.key}>
                      {/*
                        Handle array values (specialties) differently from primitives
                        Each specialty gets its own div with a unique key
                      */}
                      {Array.isArray(value) ? (
                        value.map((item, idx) => (
                          <div key={`${rowKey}-${col.key}-${idx}`}>{item}</div>
                        ))
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
