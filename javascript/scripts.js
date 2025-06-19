  window.batchFiles = {
    _files: [],
    createFolderTreeFromUpload: async function (inputElement) {
      this._files = [];
      const allowedTypes = ['application/pdf'];
      const uploadedFiles = Array.from(inputElement.files).filter(file =>
        allowedTypes.includes(file.type)
      );
      this._files = uploadedFiles;
      this.renderFiles();
    },
    registerDropHandler: async function (dropZoneElement) {
      dropZoneElement.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZoneElement.classList.add('dragover');
      });
      dropZoneElement.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZoneElement.classList.remove('dragover');
      });
      dropZoneElement.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropZoneElement.classList.remove('dragover');
        this._files = [];
        const items = e.dataTransfer.items;
        const entries = [];
        for (const item of items) {
          const entry = item.webkitGetAsEntry();
          if (entry) entries.push(entry);
        }
        for (const entry of entries) {
          await this.traverseFileTree(entry);
        }
        this.renderFiles();
      });
    },
    sanitizePath: function (path) {
      return path
        .replace(/\\/g, '/')
        .replace(/(\.\.\/)+/g, '')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    },
    traverseFileTree: function (item, path = "") {
      const self = this;
      return new Promise((resolve) => {
        if (item.isFile) {
          item.file((file) => {
            if (file.type === 'application/pdf') {
              file.relativePath = path + self.sanitizePath(file.name);
              self._files.push(file);
            }
            resolve();
          });
        } else if (item.isDirectory) {
          const dirReader = item.createReader();
          dirReader.readEntries(async entries => {
            for (let entry of entries) {
              await self.traverseFileTree(entry, path + item.name + "/");
            }
            resolve();
          });
        }
      });
    },
    renderFiles: function () {
      const container = document.getElementById('fileTree');
      container.innerHTML = '';
      if (this._files.length === 0) {
        container.innerHTML = '<div>No PDF files uploaded.</div>';
        return;
      }
      const ul = document.createElement('ul');
      ul.className = 'file-tree-items';
      this._files.forEach(file => {
        const li = document.createElement('li');
        li.className = 'file-item';
        li.textContent = `${file.relativePath || file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        ul.appendChild(li);
      });
      container.appendChild(ul);
    }
  };
 
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('folderInput');
 
  fileInput.addEventListener('change', () => {
    window.batchFiles.createFolderTreeFromUpload(fileInput);
  });
 
  window.batchFiles.registerDropHandler(dropZone);