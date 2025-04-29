// Custom color definitions for nodes
const NODE_COLORS = {
    // Input Node: Green - represents beginnings, data entry
    INPUT: {
      border: '#2e7d32', // Dark green
      handle: '#4caf50', // Medium green
      softBg: 'rgba(76, 175, 80, 0.1)', // Light green background
      text: '#2e7d32', // Dark green text
    },
    
    // Code Node: Blue - represents programming, logic
    CODE: {
      border: '#1565c0', // Dark blue
      handle: '#1976d2', // Medium blue
      softBg: 'rgba(25, 118, 210, 0.1)', // Light blue background
      text: '#1565c0', // Dark blue text
    },
    
    // AI Node: Purple - represents intelligence, processing
    AI: {
      border: '#6a1b9a', // Dark purple
      handle: '#8e24aa', // Medium purple
      softBg: 'rgba(142, 36, 170, 0.1)', // Light purple background
      text: '#6a1b9a', // Dark purple text
    },
    
    // Template Node: Teal - represents formatting, structure
    TEMPLATE: {
      border: '#00695c', // Dark teal
      handle: '#00897b', // Medium teal
      softBg: 'rgba(0, 137, 123, 0.1)', // Light teal background
      text: '#00695c', // Dark teal text
    },
    
    // Output Node: Orange - represents completion, results
    OUTPUT: {
      border: '#e65100', // Dark orange
      handle: '#f57c00', // Medium orange
      softBg: 'rgba(245, 124, 0, 0.1)', // Light orange background
      text: '#e65100', // Dark orange text
    }
  };

export { NODE_COLORS };