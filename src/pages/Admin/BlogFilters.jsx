import React, { useState } from "react";
import Select from "react-select";

const statusOptions = [
  { value: "All", label: "All" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

export const BlogFilters = ({
  categoryOptions,
  selectedCategories,
  setSelectedCategories,
  selectedStatus,
  setSelectedStatus,
  selectedSort,
  setSelectedSort,
}) => {
  const [showCategory, setShowCategory] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  return (
    <div className="filters-wrapper">
      <div className="filters-left">
        {/* Category Filter */}
        <div className="filter-box">
          <div onClick={() => setShowCategory(!showCategory)}>CATEGORIES ▾</div>
          {showCategory && (
            <div className="filter-options">
              {categoryOptions.map((cat) => (
                <div key={cat.value}>
                  <input
                    type="checkbox"
                    id={`cat-${cat.value}`}
                    value={cat.value}
                    checked={selectedCategories.some(
                      (c) => c.value === cat.value
                    )}
                    onChange={(e) =>
                      e.target.checked
                        ? setSelectedCategories([...selectedCategories, cat])
                        : setSelectedCategories(
                            selectedCategories.filter(
                              (c) => c.value !== cat.value
                            )
                          )
                    }
                  />
                  <label htmlFor={`cat-${cat.value}`}>{cat.label}</label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="filter-box">
          <div onClick={() => setShowStatus(!showStatus)}>STATUS ▾</div>
          {showStatus && (
            <div className="filter-options">
              {statusOptions
                .filter((s) => s.value !== "All")
                .map((status) => (
                  <div key={status.value}>
                    <input
                      type="checkbox"
                      id={`status-${status.value}`}
                      value={status.value}
                      checked={selectedStatus?.value === status.value}
                      onChange={(e) =>
                        setSelectedStatus(e.target.checked ? status : null)
                      }
                    />
                    <label htmlFor={`status-${status.value}`}>
                      {status.label}
                    </label>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Sort Filter */}
      <div className="sort-box">
        <label
          style={{ fontWeight: "bold", marginBottom: "5px", display: "block" }}
        >
          Sort by:
        </label>
        <Select
          options={sortOptions}
          value={selectedSort}
          onChange={setSelectedSort}
          placeholder="Sort by newest/oldest"
          isSearchable={false}
        />
      </div>
    </div>
  );
};
