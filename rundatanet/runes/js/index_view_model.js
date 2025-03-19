// view-model.js
export class RunicViewModel {
  constructor(dbMap) {
    this.dbMap = dbMap;            // Original data source
    this.searchResults = null;     // Last search results (or null if no search active)
    this.currentSelectionIds = []; // Currently selected IDs
  }
  
  // Get data for a specific ID, prioritizing search results if available
  getInscriptionData(id) {
    if (this.searchResults && this.searchResults.has(id)) {
      return this.searchResults.get(id);
    }
    return this.dbMap.get(id);
  }

  getInscriptions(ids) {
    if (this.searchResults && this.searchResults.size > 0) {
      return ids.map(id => this.searchResults.get(parseInt(id, 10)));
    }
    return ids.map(id => this.dbMap.get(parseInt(id, 10)));
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
  setSearchResults(results) {
    if (!results) {
      this.searchResults = null;
      return;
    }
    
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
      count: this.searchResults.size 
    });
  }

  // Clear search results
  clearSearchResults() {
    this.searchResults = null;
    //this.currentSelectionIds = Array.from(this.dbMap.keys());
    
    $(document).trigger('viewModelUpdated', { 
      source: 'reset',
      count: this.dbMap.size 
    });
  }
  
  // Update current selections
  // setSelection(ids) {
  //   this.currentSelectionIds = ids;
  //   $(document).trigger('selectionChanged', { ids });
  // }
}