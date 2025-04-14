import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { flowService } from '../api/services/flowService';

export const useAutosave = ({ nodes, edges, projectId }) => {
  const [saveStatus, setSaveStatus] = useState('idle');
  const [lastSaved, setLastSaved] = useState(null);

  const saveToBackend = async (data) => {
    // Don't try to save if projectId is undefined
    if (!projectId) {
      console.warn('Cannot save: projectId is undefined');
      return;
    }

    try {
      setSaveStatus('saving');

      // Call API with projectId
      await flowService.saveFlow(projectId, data);
      
      setSaveStatus('saved');
      setLastSaved(new Date());
      console.log('Saved data for project:', projectId);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');
    }
  };

  // Manual save function
  const saveNow = useCallback(() => {
    if (saveStatus !== 'saving' && projectId) {
      saveToBackend({ nodes, edges });
    }
  }, [nodes, edges, saveStatus, projectId]);

  // Force save function that returns a promise
  const forceSave = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!projectId) {
        reject(new Error('Cannot save: projectId is undefined'));
        return;
      }

      if (saveStatus === 'saving') {
        // If already saving, wait for it to complete
        const checkStatus = setInterval(() => {
          if (saveStatus !== 'saving') {
            clearInterval(checkStatus);
            resolve(true);
          }
        }, 100);
      } else {
        // Start a new save
        saveToBackend({ nodes, edges })
          .then(() => resolve(true))
          .catch(err => reject(err));
      }
    });
  }, [nodes, edges, projectId, saveStatus]);

  // Debounced auto-save with 5 second delay
  const debouncedSave = useCallback(
    debounce((data) => saveToBackend(data), 5000),
    [projectId]
  );

  // Save on significant changes
  useEffect(() => {
    if ((nodes.length || edges.length) && projectId) {
      setSaveStatus('pending');
      debouncedSave({ nodes, edges });
    }
  }, [nodes, edges, projectId]);

  // Ctrl+S handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveNow();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveNow]);

  // Save before unload
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (saveStatus === 'pending') {
        event.preventDefault();
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus]);

  return { saveStatus, lastSaved, saveNow, forceSave };
};