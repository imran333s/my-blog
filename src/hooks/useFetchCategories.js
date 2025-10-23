// src/hooks/useFetchCategories.js
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { fetchCategories } from "../services/blogService";

export const useFetchCategories = () => {
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const activeCategories = await fetchCategories();
        const formatted = activeCategories.map((cat) => ({
          value: cat.name,
          label: cat.name,
        }));
        setCategoryOptions(formatted);
      } catch (err) {
        console.error("Error fetching categories:", err);
        Swal.fire("Error", "Could not load categories", "error");
      }
    };
    loadCategories();
  }, []);

  return categoryOptions;
};
