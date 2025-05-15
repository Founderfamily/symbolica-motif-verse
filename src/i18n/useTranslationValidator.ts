
import { useEffect } from 'react';
import i18n from './config';
import en from './locales/en.json';
import fr from './locales/fr.json';

/**
 * A development tool to validate translation keys and detect missing translations.
 * This should be used in the root component of the app during development.
 */
export const useTranslationValidator = () => {
  useEffect(() => {
    // Only run in development environment
    if (process.env.NODE_ENV !== 'development') {
      return;
    }
    
    // Initial validation on app start
    setTimeout(() => {
      validateTranslations();
      
      // Scan for t() function direct usage
      scanForDirectTUsage();
    }, 1000);
    
    const validateTranslations = () => {
      // Check if all English keys exist in French translations
      const missingInFrench = findMissingKeys(en, fr, 'en');
      
      // Check if all French keys exist in English translations
      const missingInEnglish = findMissingKeys(fr, en, 'fr');
      
      // Check for potential format inconsistencies
      const potentialFormatIssues = findFormatInconsistencies(en, fr);
      
      // Log any issues found
      if (missingInFrench.length > 0 || missingInEnglish.length > 0) {
        console.error('🚨 TRANSLATION VALIDATION FAILED 🚨');
        
        if (missingInFrench.length > 0) {
          console.error('⚠️ Missing French translations:', missingInFrench);
        }
        
        if (missingInEnglish.length > 0) {
          console.error('⚠️ Missing English translations:', missingInEnglish);
        }
        
        if (potentialFormatIssues.length > 0) {
          console.warn('⚠️ Potential format inconsistencies:', potentialFormatIssues);
        }
        
        console.error('🔎 Please add the missing translation keys to maintain complete localization.');
        
        // Show prominent visual warning in development
        displayVisualWarning(missingInFrench.length + missingInEnglish.length, potentialFormatIssues.length);
      } else {
        console.info('✅ Translation validation passed: All keys are present in both languages.');
        
        if (potentialFormatIssues.length > 0) {
          console.warn('⚠️ Translation format warning: Some translations may have inconsistent formats between languages.');
          console.warn('Potential format issues:', potentialFormatIssues);
        }
      }
    };
    
    // Set up event listener for validation panel requests
    const validateListener = () => {
      toggleMissingTranslationsPanel();
    };
    
    window.addEventListener('validate-translations', validateListener);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('validate-translations', validateListener);
    };
  }, []);
};

/**
 * Look for direct usage of t() function instead of I18nText component
 * This helps detect where developers might be bypassing the I18nText component
 */
const scanForDirectTUsage = () => {
  // Wait for DOM to be ready
  setTimeout(() => {
    try {
      // Use MutationObserver to monitor for text content changes
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'characterData' || mutation.type === 'childList') {
            const node = mutation.target;
            if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
              // Check if text content might be a translation key
              const text = node.textContent?.trim() || '';
              if (text && text.includes('.') && text.length > 3 && !text.includes(' ')) {
                // Check if it's actually a valid translation key
                if (i18n.exists(text)) {
                  console.warn(`⚠️ Potential direct t() usage detected for key: ${text}`);
                  
                  // Highlight the element containing this key
                  if (node.parentElement) {
                    const original = {
                      outline: node.parentElement.style.outline,
                      background: node.parentElement.style.backgroundColor
                    };
                    
                    node.parentElement.style.outline = '2px dotted #ff9800';
                    node.parentElement.style.backgroundColor = 'rgba(255, 152, 0, 0.1)';
                    
                    // Restore after a delay
                    setTimeout(() => {
                      node.parentElement!.style.outline = original.outline;
                      node.parentElement!.style.backgroundColor = original.background;
                    }, 2000);
                  }
                }
              }
            }
          }
        });
      });
      
      // Start observing
      observer.observe(document.body, { 
        childList: true, 
        characterData: true,
        subtree: true 
      });
      
      // Stop after some time to avoid performance issues
      setTimeout(() => observer.disconnect(), 5000);
    } catch (e) {
      console.debug('Error scanning for direct t() usage:', e);
    }
  }, 2000);
};

/**
 * Creates a visual warning element in the UI for developers
 */
const displayVisualWarning = (missingCount: number, formatIssuesCount: number) => {
  const existingWarning = document.getElementById('translation-validation-warning');
  if (existingWarning) {
    existingWarning.remove();
  }
  
  const warningElement = document.createElement('div');
  warningElement.id = 'translation-validation-warning';
  warningElement.style.position = 'fixed';
  warningElement.style.top = '0';
  warningElement.style.left = '0';
  warningElement.style.right = '0';
  warningElement.style.backgroundColor = missingCount > 0 ? '#ef4444' : '#f59e0b';
  warningElement.style.color = 'white';
  warningElement.style.padding = '8px';
  warningElement.style.textAlign = 'center';
  warningElement.style.fontWeight = 'bold';
  warningElement.style.fontSize = '14px';
  warningElement.style.zIndex = '9999';
  warningElement.style.cursor = 'pointer';
  
  let warningText = '';
  if (missingCount > 0) {
    warningText = `⚠️ Translation issues: ${missingCount} missing key(s)`;
    if (formatIssuesCount > 0) {
      warningText += ` and ${formatIssuesCount} format inconsistencies`;
    }
  } else if (formatIssuesCount > 0) {
    warningText = `⚠️ Translation warning: ${formatIssuesCount} format inconsistencies detected`;
  }
  
  warningText += '. Click to see details.';
  warningElement.textContent = warningText;
  
  warningElement.addEventListener('click', () => {
    toggleMissingTranslationsPanel();
  });
  
  document.body.appendChild(warningElement);
  
  // Add "Check Translations" button
  displayTranslationCheckButton();
};

/**
 * Creates or toggles a panel showing missing translations
 */
const toggleMissingTranslationsPanel = () => {
  let panel = document.getElementById('missing-translations-panel');
  
  if (panel) {
    panel.remove();
    return;
  }
  
  panel = document.createElement('div');
  panel.id = 'missing-translations-panel';
  panel.style.position = 'fixed';
  panel.style.top = '40px';
  panel.style.right = '20px';
  panel.style.width = '450px';
  panel.style.maxHeight = '80vh';
  panel.style.overflowY = 'auto';
  panel.style.backgroundColor = 'white';
  panel.style.border = '1px solid #e5e7eb';
  panel.style.borderRadius = '8px';
  panel.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  panel.style.zIndex = '9998';
  panel.style.padding = '16px';
  
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '16px';
  header.style.paddingBottom = '8px';
  header.style.borderBottom = '1px solid #e5e7eb';
  
  const title = document.createElement('h3');
  title.textContent = 'Translation Issues';
  title.style.fontWeight = 'bold';
  title.style.fontSize = '18px';
  title.style.margin = '0';
  
  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '8px';
  
  const refreshBtn = document.createElement('button');
  refreshBtn.textContent = '🔄';
  refreshBtn.title = 'Refresh';
  refreshBtn.style.backgroundColor = '#f3f4f6';
  refreshBtn.style.border = '1px solid #d1d5db';
  refreshBtn.style.borderRadius = '4px';
  refreshBtn.style.padding = '4px 8px';
  refreshBtn.style.cursor = 'pointer';
  refreshBtn.onclick = () => {
    panel!.remove();
    setTimeout(() => {
      const event = new CustomEvent('validate-translations');
      window.dispatchEvent(event);
    }, 100);
  };
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.backgroundColor = 'transparent';
  closeBtn.style.border = 'none';
  closeBtn.style.fontSize = '24px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.lineHeight = '1';
  closeBtn.onclick = () => panel!.remove();
  
  actions.appendChild(refreshBtn);
  actions.appendChild(closeBtn);
  
  header.appendChild(title);
  header.appendChild(actions);
  panel.appendChild(header);
  
  // Add tabs for different issues
  const tabContainer = document.createElement('div');
  tabContainer.style.display = 'flex';
  tabContainer.style.marginBottom = '16px';
  tabContainer.style.borderBottom = '1px solid #e5e7eb';
  
  const createTab = (label: string, isActive: boolean = false) => {
    const tab = document.createElement('button');
    tab.textContent = label;
    tab.style.padding = '8px 12px';
    tab.style.border = 'none';
    tab.style.backgroundColor = 'transparent';
    tab.style.borderBottom = isActive ? '2px solid #3b82f6' : '2px solid transparent';
    tab.style.fontWeight = isActive ? 'bold' : 'normal';
    tab.style.color = isActive ? '#3b82f6' : '#374151';
    tab.style.cursor = 'pointer';
    return tab;
  };
  
  const missingTab = createTab('Missing Keys', true);
  const formatTab = createTab('Format Issues');
  const usageTab = createTab('Usage Issues');
  
  tabContainer.appendChild(missingTab);
  tabContainer.appendChild(formatTab);
  tabContainer.appendChild(usageTab);
  panel.appendChild(tabContainer);
  
  // Container for tab content
  const contentContainer = document.createElement('div');
  panel.appendChild(contentContainer);
  
  // Setup tab click handlers
  const showTab = (tabName: 'missing' | 'format' | 'usage') => {
    // Update tabs visual state
    [missingTab, formatTab, usageTab].forEach(tab => {
      tab.style.borderBottom = '2px solid transparent';
      tab.style.fontWeight = 'normal';
      tab.style.color = '#374151';
    });
    
    if (tabName === 'missing') {
      missingTab.style.borderBottom = '2px solid #3b82f6';
      missingTab.style.fontWeight = 'bold';
      missingTab.style.color = '#3b82f6';
      showMissingTranslations(contentContainer);
    } else if (tabName === 'format') {
      formatTab.style.borderBottom = '2px solid #3b82f6';
      formatTab.style.fontWeight = 'bold';
      formatTab.style.color = '#3b82f6';
      showFormatIssues(contentContainer);
    } else {
      usageTab.style.borderBottom = '2px solid #3b82f6';
      usageTab.style.fontWeight = 'bold';
      usageTab.style.color = '#3b82f6';
      showDirectUsageIssues(contentContainer);
    }
  };
  
  missingTab.onclick = () => showTab('missing');
  formatTab.onclick = () => showTab('format');
  usageTab.onclick = () => showTab('usage');
  
  // Show missing translations tab by default
  showTab('missing');
  
  document.body.appendChild(panel);
};

/**
 * Show missing translations in the panel
 */
const showMissingTranslations = (container: HTMLElement) => {
  // Clear content
  container.innerHTML = '';
  
  // Add missing keys content
  const missingInFrench = findMissingKeys(en, fr, 'en');
  const missingInEnglish = findMissingKeys(fr, en, 'fr');
  
  if (missingInFrench.length === 0 && missingInEnglish.length === 0) {
    const noIssuesEl = document.createElement('div');
    noIssuesEl.textContent = '✅ No missing translations detected.';
    noIssuesEl.style.padding = '12px';
    noIssuesEl.style.color = '#10b981';
    container.appendChild(noIssuesEl);
    return;
  }
  
  // Function to create a section for missing keys
  const createMissingSection = (title: string, keys: string[]) => {
    if (keys.length === 0) return null;
    
    const section = document.createElement('div');
    section.style.marginBottom = '16px';
    
    const sectionTitle = document.createElement('h4');
    sectionTitle.textContent = title;
    sectionTitle.style.margin = '0 0 8px 0';
    sectionTitle.style.fontSize = '16px';
    sectionTitle.style.fontWeight = 'bold';
    section.appendChild(sectionTitle);
    
    const keysList = document.createElement('ul');
    keysList.style.margin = '0';
    keysList.style.padding = '0 0 0 20px';
    keysList.style.listStyle = 'disc';
    
    keys.forEach(key => {
      const keyItem = document.createElement('li');
      keyItem.style.margin = '4px 0';
      
      const keyCode = document.createElement('code');
      keyCode.textContent = key;
      keyCode.style.fontFamily = 'monospace';
      keyCode.style.backgroundColor = '#f1f5f9';
      keyCode.style.padding = '2px 4px';
      keyCode.style.borderRadius = '4px';
      
      keyItem.appendChild(keyCode);
      keysList.appendChild(keyItem);
    });
    
    section.appendChild(keysList);
    return section;
  };
  
  const enSection = createMissingSection('Missing in English', missingInEnglish);
  const frSection = createMissingSection('Missing in French', missingInFrench);
  
  if (enSection) container.appendChild(enSection);
  if (frSection) container.appendChild(frSection);
  
  // Add a help section
  const helpSection = document.createElement('div');
  helpSection.style.marginTop = '16px';
  helpSection.style.padding = '12px';
  helpSection.style.backgroundColor = '#f9fafb';
  helpSection.style.borderRadius = '4px';
  helpSection.style.fontSize = '14px';
  
  const helpTitle = document.createElement('h4');
  helpTitle.textContent = 'How to fix';
  helpTitle.style.margin = '0 0 8px 0';
  helpTitle.style.fontSize = '14px';
  helpTitle.style.fontWeight = 'bold';
  helpSection.appendChild(helpTitle);
  
  const helpText = document.createElement('p');
  helpText.textContent = 'Add these missing keys to the corresponding language files in src/i18n/locales/';
  helpText.style.margin = '0 0 8px 0';
  helpSection.appendChild(helpText);
  
  container.appendChild(helpSection);
};

/**
 * Show format inconsistencies in the panel
 */
const showFormatIssues = (container: HTMLElement) => {
  // Clear content
  container.innerHTML = '';
  
  // Find potential format issues
  const formatIssues = findFormatInconsistencies(en, fr);
  
  if (formatIssues.length === 0) {
    const noIssuesEl = document.createElement('div');
    noIssuesEl.textContent = '✅ No format inconsistencies detected.';
    noIssuesEl.style.padding = '12px';
    noIssuesEl.style.color = '#10b981';
    container.appendChild(noIssuesEl);
    return;
  }
  
  const issuesTable = document.createElement('table');
  issuesTable.style.width = '100%';
  issuesTable.style.borderCollapse = 'collapse';
  
  // Create header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  
  const keyHeader = document.createElement('th');
  keyHeader.textContent = 'Key';
  keyHeader.style.textAlign = 'left';
  keyHeader.style.padding = '8px';
  keyHeader.style.borderBottom = '1px solid #e5e7eb';
  
  const enHeader = document.createElement('th');
  enHeader.textContent = 'English';
  enHeader.style.textAlign = 'left';
  enHeader.style.padding = '8px';
  enHeader.style.borderBottom = '1px solid #e5e7eb';
  
  const frHeader = document.createElement('th');
  frHeader.textContent = 'French';
  frHeader.style.textAlign = 'left';
  frHeader.style.padding = '8px';
  frHeader.style.borderBottom = '1px solid #e5e7eb';
  
  headerRow.appendChild(keyHeader);
  headerRow.appendChild(enHeader);
  headerRow.appendChild(frHeader);
  thead.appendChild(headerRow);
  issuesTable.appendChild(thead);
  
  // Create table body
  const tbody = document.createElement('tbody');
  
  formatIssues.forEach(issue => {
    const row = document.createElement('tr');
    
    const keyCell = document.createElement('td');
    keyCell.style.padding = '8px';
    keyCell.style.borderBottom = '1px solid #e5e7eb';
    
    const keyCode = document.createElement('code');
    keyCode.textContent = issue.key;
    keyCode.style.fontFamily = 'monospace';
    keyCode.style.backgroundColor = '#f1f5f9';
    keyCode.style.padding = '2px 4px';
    keyCode.style.borderRadius = '4px';
    keyCell.appendChild(keyCode);
    
    const enCell = document.createElement('td');
    enCell.textContent = issue.en;
    enCell.style.padding = '8px';
    enCell.style.borderBottom = '1px solid #e5e7eb';
    
    const frCell = document.createElement('td');
    frCell.textContent = issue.fr;
    frCell.style.padding = '8px';
    frCell.style.borderBottom = '1px solid #e5e7eb';
    
    row.appendChild(keyCell);
    row.appendChild(enCell);
    row.appendChild(frCell);
    tbody.appendChild(row);
  });
  
  issuesTable.appendChild(tbody);
  container.appendChild(issuesTable);
  
  // Add help text
  const helpSection = document.createElement('div');
  helpSection.style.marginTop = '16px';
  helpSection.style.padding = '12px';
  helpSection.style.backgroundColor = '#f9fafb';
  helpSection.style.borderRadius = '4px';
  helpSection.style.fontSize = '14px';
  
  const helpTitle = document.createElement('h4');
  helpTitle.textContent = 'How to fix';
  helpTitle.style.margin = '0 0 8px 0';
  helpTitle.style.fontSize = '14px';
  helpTitle.style.fontWeight = 'bold';
  helpSection.appendChild(helpTitle);
  
  const helpText = document.createElement('p');
  helpText.textContent = 'Ensure that translations are consistent between languages. Important details like product name, version format, etc. should be consistent.';
  helpText.style.margin = '0 0 8px 0';
  helpSection.appendChild(helpText);
  
  container.appendChild(helpSection);
};

/**
 * Show direct usage issues in the panel
 */
const showDirectUsageIssues = (container: HTMLElement) => {
  // Clear content
  container.innerHTML = '';
  
  // Scan the page for direct key usage
  const directUsage = scanPageForDirectKeyUsage();
  
  if (directUsage.length === 0) {
    const noIssuesEl = document.createElement('div');
    noIssuesEl.textContent = '✅ No direct t() usage detected on this page.';
    noIssuesEl.style.padding = '12px';
    noIssuesEl.style.color = '#10b981';
    container.appendChild(noIssuesEl);
    
    const note = document.createElement('p');
    note.textContent = 'Note: This scan only detects issues on the current page.';
    note.style.fontSize = '13px';
    note.style.fontStyle = 'italic';
    note.style.margin = '8px 0 0 0';
    note.style.color = '#64748b';
    container.appendChild(note);
    return;
  }
  
  // Create list of direct usage issues
  const usageList = document.createElement('ul');
  usageList.style.margin = '0 0 16px 0';
  usageList.style.padding = '0';
  usageList.style.listStyle = 'none';
  
  directUsage.forEach(key => {
    const item = document.createElement('li');
    item.style.padding = '8px 12px';
    item.style.margin = '0 0 8px 0';
    item.style.backgroundColor = '#fef2f2';
    item.style.borderLeft = '3px solid #ef4444';
    item.style.borderRadius = '4px';
    
    const keyCode = document.createElement('code');
    keyCode.textContent = key;
    keyCode.style.fontFamily = 'monospace';
    keyCode.style.backgroundColor = '#fee2e2';
    keyCode.style.padding = '2px 4px';
    keyCode.style.borderRadius = '4px';
    
    const text = document.createElement('span');
    text.textContent = 'Direct usage of t() or translation key: ';
    
    item.appendChild(text);
    item.appendChild(keyCode);
    usageList.appendChild(item);
  });
  
  container.appendChild(usageList);
  
  // Add help text
  const helpSection = document.createElement('div');
  helpSection.style.marginTop = '16px';
  helpSection.style.padding = '12px';
  helpSection.style.backgroundColor = '#f9fafb';
  helpSection.style.borderRadius = '4px';
  helpSection.style.fontSize = '14px';
  
  const helpTitle = document.createElement('h4');
  helpTitle.textContent = 'How to fix';
  helpTitle.style.margin = '0 0 8px 0';
  helpTitle.style.fontSize = '14px';
  helpTitle.style.fontWeight = 'bold';
  helpSection.appendChild(helpTitle);
  
  const helpText = document.createElement('p');
  helpText.innerHTML = 'Always use the <code>&lt;I18nText&gt;</code> component instead of directly calling <code>t()</code> function:';
  helpText.style.margin = '0 0 8px 0';
  helpSection.appendChild(helpText);
  
  const codeExample = document.createElement('pre');
  codeExample.style.backgroundColor = '#f8fafc';
  codeExample.style.padding = '8px';
  codeExample.style.borderRadius = '4px';
  codeExample.style.fontSize = '13px';
  codeExample.style.overflowX = 'auto';
  codeExample.textContent = '// Instead of this:\n{t("key.example")}\n\n// Use this:\n<I18nText translationKey="key.example" />';
  helpSection.appendChild(codeExample);
  
  container.appendChild(helpSection);
};

/**
 * Creates the "Check Translations" button
 */
const displayTranslationCheckButton = () => {
  // Remove existing button if present
  const existingButton = document.getElementById('translation-check-button');
  if (existingButton) existingButton.remove();
  
  const checkButton = document.createElement('button');
  checkButton.id = 'translation-check-button';
  checkButton.textContent = '🔍 Check Translations';
  checkButton.style.position = 'fixed';
  checkButton.style.bottom = '20px';
  checkButton.style.right = '20px';
  checkButton.style.backgroundColor = '#3b82f6';
  checkButton.style.color = 'white';
  checkButton.style.padding = '10px 16px';
  checkButton.style.borderRadius = '6px';
  checkButton.style.border = 'none';
  checkButton.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  checkButton.style.zIndex = '9998';
  checkButton.style.fontSize = '14px';
  checkButton.style.fontWeight = 'bold';
  checkButton.style.cursor = 'pointer';
  
  checkButton.addEventListener('mouseenter', () => {
    checkButton.style.backgroundColor = '#2563eb';
  });
  
  checkButton.addEventListener('mouseleave', () => {
    checkButton.style.backgroundColor = '#3b82f6';
  });
  
  checkButton.addEventListener('click', () => {
    const event = new CustomEvent('validate-translations');
    window.dispatchEvent(event);
  });
  
  document.body.appendChild(checkButton);
};

/**
 * Scan for direct key usage in the page
 */
const scanPageForDirectKeyUsage = () => {
  const directUsage: string[] = [];
  
  try {
    // Look for text nodes that might be translation keys
    const textNodes = [];
    const walk = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let node;
    while ((node = walk.nextNode())) {
      const text = node.textContent?.trim() || '';
      // Skip empty nodes and those inside scripts or styles
      if (!text || 
          node.parentElement?.tagName === 'SCRIPT' || 
          node.parentElement?.tagName === 'STYLE') continue;
      
      // Check if it looks like a translation key (contains dots, no spaces)
      if (text.includes('.') && !text.includes(' ') && text.length > 3) {
        // Check if it matches a valid translation key
        if (i18n.exists(text) && !isHTMLCode(text)) {
          directUsage.push(text);
        }
      }
    }
  } catch (e) {
    console.debug('Error scanning for direct key usage:', e);
  }
  
  return [...new Set(directUsage)]; // Return unique values only
};

/**
 * Check if a string is HTML/JSX code rather than a translation key
 */
const isHTMLCode = (text: string): boolean => {
  return text.startsWith('<') || text.includes('</') || text.includes('/>');
};

/**
 * Find potential format inconsistencies between languages
 */
const findFormatInconsistencies = (
  en: Record<string, any>,
  fr: Record<string, any>,
  prefix = ''
): {key: string, en: string, fr: string}[] => {
  const issues: {key: string, en: string, fr: string}[] = [];
  
  const checkValues = (enValue: any, frValue: any, key: string) => {
    // Only check strings
    if (typeof enValue !== 'string' || typeof frValue !== 'string') return;
    
    // Skip very short strings
    if (enValue.length < 4 || frValue.length < 4) return;
    
    // Check for capitalization differences
    const enStarts = enValue.charAt(0);
    const frStarts = frValue.charAt(0);
    if (enStarts.toUpperCase() === enStarts && frStarts.toLowerCase() === frStarts) {
      issues.push({ key, en: enValue, fr: frValue });
      return;
    }
    
    // Check for specific patterns - for example "Alpha" vs "Version Alpha"
    // This is a simplified check - you may want to enhance it
    const significantEnglishWords = ['version', 'alpha', 'beta', 'release'];
    for (const word of significantEnglishWords) {
      const enHas = enValue.toLowerCase().includes(word);
      const frHas = frValue.toLowerCase().includes(word);
      if (enHas !== frHas) {
        issues.push({ key, en: enValue, fr: frValue });
        return;
      }
    }
  };
  
  const traverseObjects = (
    enObj: Record<string, any>,
    frObj: Record<string, any>,
    currentPrefix = ''
  ) => {
    for (const key of Object.keys(enObj)) {
      const fullKey = currentPrefix ? `${currentPrefix}.${key}` : key;
      const enValue = enObj[key];
      const frValue = frObj[key];
      
      if (typeof enValue === 'object' && enValue !== null && 
          typeof frValue === 'object' && frValue !== null) {
        // Recurse into nested objects
        traverseObjects(enValue, frValue, fullKey);
      } else if (frObj.hasOwnProperty(key)) {
        // Compare values
        checkValues(enValue, frValue, fullKey);
      }
    }
  };
  
  traverseObjects(en, fr);
  return issues;
};

/**
 * Recursively finds keys that exist in the source object but not in the target object
 */
const findMissingKeys = (
  source: Record<string, any>, 
  target: Record<string, any>, 
  sourceLanguage: string,
  prefix = ''
): string[] => {
  const missingKeys: string[] = [];
  
  Object.entries(source).forEach(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // If it's an object, recurse deeper
      if (target[key] === undefined) {
        missingKeys.push(`${fullKey} (entire section missing)`);
      } else if (typeof target[key] !== 'object') {
        missingKeys.push(`${fullKey} (expected object but found ${typeof target[key]})`);
      } else {
        missingKeys.push(...findMissingKeys(value, target[key], sourceLanguage, fullKey));
      }
    } else {
      // For primitive values, just check if the key exists
      if (target[key] === undefined) {
        missingKeys.push(`${fullKey}`);
      }
    }
  });
  
  return missingKeys;
};

/**
 * Use this hook to check if a specific key exists in both locales
 * @returns boolean indicating if the key exists in both locales
 */
export const validateTranslationKey = (key: string): boolean => {
  const keyExists = {
    en: keyExistsInObject(key, en),
    fr: keyExistsInObject(key, fr)
  };
  
  const isValid = keyExists.en && keyExists.fr;
  
  if (!isValid && process.env.NODE_ENV === 'development') {
    console.warn(`⚠️ Translation key issue detected: '${key}'`);
    if (!keyExists.en) console.warn(`  - Missing English translation`);
    if (!keyExists.fr) console.warn(`  - Missing French translation`);
    
    // Highlight the element in the UI that's using this missing key
    highlightElementWithMissingTranslation(key);
  }
  
  return isValid;
};

/**
 * Highlights elements in the UI that are using missing translation keys
 */
const highlightElementWithMissingTranslation = (key: string) => {
  // This is a simplified approach - in a real implementation, you would need to
  // find the actual elements using this translation key
  setTimeout(() => {
    // Add visual indicator for elements with data-i18n-key attribute matching the key
    const elements = document.querySelectorAll(`[data-i18n-key="${key}"]`);
    if (elements.length > 0) {
      elements.forEach(el => {
        // Type assertion to access style properties
        const element = el as HTMLElement;
        const originalBorder = element.style.outline;
        const originalBg = element.style.backgroundColor;
        
        element.style.outline = '2px dashed #ef4444';
        element.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        
        // Restore original styling after a short delay
        setTimeout(() => {
          element.style.outline = originalBorder;
          element.style.backgroundColor = originalBg;
        }, 2000);
      });
    }
  }, 100);
};

/**
 * Helper to check if a nested key exists in an object
 */
const keyExistsInObject = (path: string, obj: Record<string, any>): boolean => {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current[part] === undefined) {
      return false;
    }
    current = current[part];
  }
  
  return true;
};
