// =========================================================================
// DataTable — sortable / filterable / searchable / CSV-exportable table
//
// Usage:
//   <DataTable
//     columns={[
//       { key: 'table', label: 'Table', render: r => 'T' + r.table },
//       { key: 'revenue', label: 'Revenue YTD', num: true, format: v => '$' + v.toLocaleString() },
//       { key: 'type', label: 'Type', filterable: true }
//     ]}
//     rows={data}
//     csvName="earnings-by-table.csv"
//     defaultSort={{ key: 'revenue', dir: 'desc' }}
//   />
// =========================================================================

function DataTable({ columns, rows, csvName = "data.csv", defaultSort, dense = false, onRowClick }) {
  const [sort, setSort] = useState(defaultSort || null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({}); // { columnKey: Set<value> }
  const [openFilter, setOpenFilter] = useState(null); // column key for which filter menu is open

  // Discrete values per filterable column
  const filterableColumns = columns.filter(c => c.filterable);
  const valueSets = useMemo(() => {
    const sets = {};
    filterableColumns.forEach(c => {
      const set = new Set();
      rows.forEach(r => {
        const v = c.filterValue ? c.filterValue(r) : r[c.key];
        if (v != null) set.add(v);
      });
      sets[c.key] = [...set].sort();
    });
    return sets;
  }, [rows]);

  // Apply filters + search
  const visible = useMemo(() => {
    let out = rows;
    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(r => columns.some(c => {
        const v = r[c.key];
        return v != null && String(v).toLowerCase().includes(q);
      }));
    }
    // filters
    Object.entries(filters).forEach(([colKey, set]) => {
      if (!set || set.size === 0) return;
      const col = columns.find(c => c.key === colKey);
      if (!col) return;
      out = out.filter(r => {
        const v = col.filterValue ? col.filterValue(r) : r[colKey];
        return set.has(v);
      });
    });
    // sort
    if (sort && sort.key) {
      const col = columns.find(c => c.key === sort.key);
      if (col) {
        out = [...out].sort((a, b) => {
          let av = col.sortValue ? col.sortValue(a) : a[sort.key];
          let bv = col.sortValue ? col.sortValue(b) : b[sort.key];
          if (typeof av === "string") av = av.toLowerCase();
          if (typeof bv === "string") bv = bv.toLowerCase();
          if (av === bv) return 0;
          if (av == null) return 1;
          if (bv == null) return -1;
          return (av < bv ? -1 : 1) * (sort.dir === "desc" ? -1 : 1);
        });
      }
    }
    return out;
  }, [rows, search, filters, sort, columns]);

  function toggleSort(key) {
    if (!sort || sort.key !== key) setSort({ key, dir: "asc" });
    else if (sort.dir === "asc") setSort({ key, dir: "desc" });
    else setSort(null);
  }

  function toggleFilter(colKey, value) {
    setFilters(prev => {
      const set = new Set(prev[colKey] || []);
      if (set.has(value)) set.delete(value); else set.add(value);
      return { ...prev, [colKey]: set };
    });
  }

  function clearFilters() {
    setFilters({});
    setSearch("");
  }

  function downloadCsv() {
    const header = columns.map(c => c.csvLabel || c.label).join(",");
    const rowsCsv = visible.map(r => columns.map(c => {
      let v = c.csvValue ? c.csvValue(r) : (c.sortValue ? c.sortValue(r) : r[c.key]);
      if (v == null) v = "";
      v = String(v);
      if (/[",\n]/.test(v)) v = '"' + v.replace(/"/g, '""') + '"';
      return v;
    }).join(","));
    const csv = [header, ...rowsCsv].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = csvName;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  const totalFilters = Object.values(filters).reduce((s, set) => s + (set ? set.size : 0), 0);

  return (
    <div className={"dt " + (dense ? "dt-dense" : "")}>
      {/* Toolbar */}
      <div className="dt-toolbar">
        <div className="dt-search">
          <Icon name="search" size={13}/>
          <input
            placeholder="Search this table…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {filterableColumns.map(col => {
          const set = filters[col.key] || new Set();
          const open = openFilter === col.key;
          return (
            <div key={col.key} className="dt-filter-wrap">
              <button
                className={"dt-filter-chip " + (set.size > 0 ? "active" : "")}
                onClick={() => setOpenFilter(open ? null : col.key)}
              >
                <Icon name="filter" size={11}/>
                <span>{col.label}</span>
                {set.size > 0 && <span className="dt-chip-count">{set.size}</span>}
              </button>
              {open && (
                <div className="dt-filter-menu" onMouseLeave={() => setOpenFilter(null)}>
                  <div className="dt-filter-menu-head">
                    <span>Filter by {col.label}</span>
                    {set.size > 0 && (
                      <span className="dt-filter-clear" onClick={() => setFilters(prev => ({ ...prev, [col.key]: new Set() }))}>
                        Clear
                      </span>
                    )}
                  </div>
                  {valueSets[col.key].map(v => (
                    <label key={String(v)} className="dt-filter-option">
                      <input
                        type="checkbox"
                        checked={set.has(v)}
                        onChange={() => toggleFilter(col.key, v)}
                      />
                      <span>{v == null ? "—" : String(v)}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {(totalFilters > 0 || search) && (
          <button className="dt-clear-all" onClick={clearFilters}>Clear all</button>
        )}

        <div style={{flex: 1}}/>
        <span className="dt-count">{visible.length} of {rows.length}</span>
        <button className="dt-action" onClick={downloadCsv} title="Download as CSV">
          <Icon name="download" size={12}/>
          <span>CSV</span>
        </button>
      </div>

      {/* Table */}
      <table className="dt-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className={(col.num ? "num " : "") + ((col.sortable !== false) ? "dt-sortable " : "") + (sort && sort.key === col.key ? "dt-sorted" : "")}
                onClick={() => col.sortable !== false && toggleSort(col.key)}
                style={{width: col.width}}
              >
                <span style={{display: "inline-flex", alignItems: "center", gap: 5}}>
                  <span>{col.label}</span>
                  {col.sortable !== false && (
                    <span className="dt-sort-arrow">
                      {sort && sort.key === col.key
                        ? (sort.dir === "asc" ? "▲" : "▼")
                        : "↕"}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visible.length === 0 ? (
            <tr><td colSpan={columns.length} style={{textAlign: "center", padding: "30px 0", color: "var(--fg-muted)", fontSize: 13}}>No rows match.</td></tr>
          ) : visible.map((r, i) => (
            <tr key={r._key || i} onClick={() => onRowClick && onRowClick(r)} style={{cursor: onRowClick ? "pointer" : "default"}}>
              {columns.map(col => (
                <td key={col.key} className={col.num ? "num" : ""}>
                  {col.render ? col.render(r) : (col.format ? col.format(r[col.key]) : r[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Object.assign(window, { DataTable });
