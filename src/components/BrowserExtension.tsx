import React, { useState } from 'react';
import { Download, Chrome, Firefox, Edge, Copy, Check } from 'lucide-react';

export function BrowserExtension() {
  const [copiedManifest, setCopiedManifest] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const manifestContent = `{
  "manifest_version": 3,
  "name": "ShareTrek - Quick File Share",
  "version": "1.0.0",
  "description": "Quickly share files from any webpage using ShareTrek",
  "permissions": ["activeTab", "storage"],
  "action": {
    "default_popup": "popup.html",
    "default_title": "ShareTrek"
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }],
  "web_accessible_resources": [{
    "resources": ["popup.html"],
    "matches": ["<all_urls>"]
  }]
}`;

  const popupHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { width: 300px; padding: 16px; font-family: system-ui; }
    .header { text-align: center; margin-bottom: 16px; }
    .logo { width: 32px; height: 32px; background: linear-gradient(45deg, #3b82f6, #8b5cf6); border-radius: 8px; margin: 0 auto 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; }
    .title { font-size: 18px; font-weight: 600; color: #1f2937; }
    .subtitle { font-size: 12px; color: #6b7280; }
    .upload-area { border: 2px dashed #d1d5db; border-radius: 8px; padding: 24px; text-align: center; margin: 16px 0; cursor: pointer; transition: all 0.2s; }
    .upload-area:hover { border-color: #3b82f6; background: #f8fafc; }
    .upload-icon { width: 24px; height: 24px; margin: 0 auto 8px; color: #6b7280; }
    .upload-text { font-size: 14px; color: #374151; font-weight: 500; }
    .upload-subtext { font-size: 12px; color: #6b7280; margin-top: 4px; }
    .btn { width: 100%; padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.2s; }
    .btn:hover { background: #2563eb; }
    .btn:disabled { background: #9ca3af; cursor: not-allowed; }
    .progress { width: 100%; height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden; margin: 8px 0; }
    .progress-bar { height: 100%; background: #3b82f6; transition: width 0.3s; }
    .result { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 12px; margin-top: 12px; }
    .share-code { font-family: monospace; font-size: 14px; font-weight: 600; color: #1e40af; }
    .copy-btn { background: #1e40af; font-size: 12px; padding: 4px 8px; margin-left: 8px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">ST</div>
    <div class="title">ShareTrek</div>
    <div class="subtitle">Quick File Share</div>
  </div>
  
  <div class="upload-area" id="uploadArea">
    <div class="upload-icon">📁</div>
    <div class="upload-text">Drop files here or click to browse</div>
    <div class="upload-subtext">Max 5GB free, larger files require payment</div>
  </div>
  
  <input type="file" id="fileInput" style="display: none;" multiple>
  
  <div id="progress" class="progress" style="display: none;">
    <div class="progress-bar" id="progressBar"></div>
  </div>
  
  <div id="result" class="result" style="display: none;">
    <div>Share Code: <span class="share-code" id="shareCode"></span>
    <button class="btn copy-btn" id="copyBtn">Copy</button></div>
  </div>
  
  <button class="btn" id="openApp">Open ShareTrek App</button>
  
  <script src="popup.js"></script>
</body>
</html>`;

  const popupJS = `document.addEventListener('DOMContentLoaded', function() {
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('fileInput');
  const progress = document.getElementById('progress');
  const progressBar = document.getElementById('progressBar');
  const result = document.getElementById('result');
  const shareCode = document.getElementById('shareCode');
  const copyBtn = document.getElementById('copyBtn');
  const openApp = document.getElementById('openApp');

  uploadArea.addEventListener('click', () => fileInput.click());
  
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#3b82f6';
    uploadArea.style.background = '#f8fafc';
  });
  
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#d1d5db';
    uploadArea.style.background = '';
  });
  
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#d1d5db';
    uploadArea.style.background = '';
    handleFiles(e.dataTransfer.files);
  });
  
  fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
  });
  
  async function handleFiles(files) {
    if (files.length === 0) return;
    
    const file = files[0];
    progress.style.display = 'block';
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      progressBar.style.width = i + '%';
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Generate mock share code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    shareCode.textContent = code;
    result.style.display = 'block';
    progress.style.display = 'none';
  }
  
  copyBtn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(shareCode.textContent);
    copyBtn.textContent = 'Copied!';
    setTimeout(() => copyBtn.textContent = 'Copy', 2000);
  });
  
  openApp.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://your-sharetrek-domain.com' });
  });
});`;

  const copyToClipboard = async (text: string, type: 'manifest' | 'script') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'manifest') {
        setCopiedManifest(true);
        setTimeout(() => setCopiedManifest(false), 2000);
      } else {
        setCopiedScript(true);
        setTimeout(() => setCopiedScript(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Browser Extension
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Install ShareTrek as a browser extension for quick file sharing from any webpage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 text-center">
          <Chrome className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h3 className="font-medium text-gray-900 dark:text-white">Chrome</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Chrome Web Store</p>
        </div>
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 text-center">
          <Firefox className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <h3 className="font-medium text-gray-900 dark:text-white">Firefox</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Firefox Add-ons</p>
        </div>
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 text-center">
          <Edge className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-medium text-gray-900 dark:text-white">Edge</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Edge Add-ons</p>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Developer Instructions
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">1. Create manifest.json</h4>
              <button
                onClick={() => copyToClipboard(manifestContent, 'manifest')}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                {copiedManifest ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedManifest ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <pre className="bg-gray-800 text-gray-100 p-3 rounded text-xs overflow-x-auto">
              {manifestContent}
            </pre>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">2. Create popup.html & popup.js</h4>
              <button
                onClick={() => copyToClipboard(popupHTML + '\n\n// popup.js\n' + popupJS, 'script')}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedScript ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-gray-800 text-gray-100 p-3 rounded text-xs overflow-x-auto max-h-40 overflow-y-auto">
              <div className="mb-4">
                <div className="text-green-400 mb-2">// popup.html</div>
                <pre>{popupHTML.substring(0, 500)}...</pre>
              </div>
              <div>
                <div className="text-green-400 mb-2">// popup.js</div>
                <pre>{popupJS.substring(0, 500)}...</pre>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Installation Steps:</h4>
            <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>1. Create a new folder for the extension</li>
              <li>2. Save the manifest.json file</li>
              <li>3. Create popup.html and popup.js files</li>
              <li>4. Open Chrome → Extensions → Developer mode</li>
              <li>5. Click "Load unpacked" and select your folder</li>
              <li>6. The extension will appear in your browser toolbar</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
        <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Extension Features:</h4>
        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
          <li>• Quick file upload from any webpage</li>
          <li>• Drag and drop support</li>
          <li>• Instant share code generation</li>
          <li>• One-click copy to clipboard</li>
          <li>• Direct link to main ShareTrek app</li>
          <li>• Works offline for local files</li>
        </ul>
      </div>
    </div>
  );
}