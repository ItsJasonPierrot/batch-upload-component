# Drag & Drop Batch Upload Component

A lightweight, self-contained drag-and-drop file upload component written in vanilla JavaScript. It supports:

- Folder uploads (with directory traversal)
- File filtering by MIME type and extension
- File preview as a tree-style list
- Manual file selection (`<input type="file" webkitdirectory>`)
- Drag-and-drop support with hover state styling
- Safe file name/path sanitization

---

## Features

- Supports PDF, Word, Excel, images, and text files
- Directory support via `webkitGetAsEntry()`
- Client-side filtering by file type and size
- Customizable file tree display
- Fully customizable and free to use

---

## 🔧 Usage

1. **Add HTML**

```html
<div id="dropZone" class="upload-container">
  <label for="folderInput" class="upload-label">
    Drag files/folders here or <span class="upload-browse">browse</span>
  </label>
  <input type="file" id="folderInput" class="upload-input" multiple webkitdirectory />
</div>

<div id="fileTree" class="file-tree"></div>
