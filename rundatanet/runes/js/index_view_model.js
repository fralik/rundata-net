// view-model.js
export class RunicViewModel {
  constructor(dbMap) {
    this.dbMap = dbMap;            // Original data source
    this.searchResults = null;     // Last search results (or null if no search active)
    this.currentSelectionIds = []; // Currently selected IDs
    this.searchRules = null;       // Last search rules (or null if no search active)
    this.allCrossForms = new Set();

    for (const inscription of dbMap.values()) {
      if (inscription.crosses && Array.isArray(inscription.crosses)) {
        for (const cross of inscription.crosses) {
          if (Array.isArray(cross)) {
            for (const group of cross) {
              if (Array.isArray(group)) {
                for (const element of group) {
                  this.allCrossForms.add(element.name);
                }
              }
            }
          }
        }
      }
    }
    this.allCrossForms = Array.from(this.allCrossForms).sort();
  }
  
  // Get data for a specific ID, prioritizing search results if available
  getInscriptionData(id) {
    if (this.searchResults && this.searchResults.has(id)) {
      return this.searchResults.get(id);
    }
    return this.dbMap.get(id);
  }

  getAllCrossForms() {
    return this.allCrossForms;
  }

  getInscriptions(ids) {
    if (this.searchResults && this.searchResults.size > 0) {
      return ids.map(id => this.searchResults.get(parseInt(id, 10)));
    }
    return ids.map(id => this.dbMap.get(parseInt(id, 10)));
  }
  
  /**
   * Retrieves all inscriptions from the database map.
   * @returns {Iterator} An iterator over all values in the database map.
   */
  getAllInscriptions() {
    return this.dbMap;
  }

  // Get all currently active inscriptions (filtered by search if a search is active)
  getActiveInscriptions() {
    if (this.searchResults) {
      return Array.from(this.searchResults.values());
    }
    return Array.from(this.dbMap.values());
  }
  
  // Get all currently active inscription IDs (filtered by search if a search is active)
  getActiveInscriptionIds() {
    if (this.searchResults) {
      return Array.from(this.searchResults.keys());
    }
    return Array.from(this.dbMap.keys());
  }

  // Update search results
  setSearchResults(results, searchRules = null) {
    if (!results) {
      this.searchResults = null;
      this.searchRules = null;
      return;
    }
    
    // Store the search rules
    this.searchRules = searchRules;
    
    // Convert array to Map for O(1) lookups
    this.searchResults = new Map();
    results.forEach(result => {
      this.searchResults.set(result.id, result);
    });
    
    // Update current selection to match search results
    // this.currentSelectionIds = Array.from(this.searchResults.keys());
    
    // Notify subscribers that data has changed
    $(document).trigger('viewModelUpdated', { 
      source: 'search',
      count: this.searchResults.size,
      model: this,
      searchRules: this.searchRules
    });
  }

  // Clear search results
  clearSearchResults() {
    this.searchResults = null;
    this.searchRules = null;
    //this.currentSelectionIds = Array.from(this.dbMap.keys());
    
    $(document).trigger('viewModelUpdated', { 
      source: 'reset',
      count: this.dbMap.size,
      model: this,
      searchRules: null
    });
  }

  // Get current search rules
  getSearchRules() {
    return this.searchRules;
  }
  
  // Update current selections
  // setSelection(ids) {
  //   this.currentSelectionIds = ids;
  //   $(document).trigger('selectionChanged', { ids });
  // }
}