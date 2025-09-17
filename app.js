document.addEventListener('DOMContentLoaded', () => {
  const loginContainer = document.getElementById('login-container');
  const adminPanel = document.getElementById('admin-panel');
  const userInfo = document.getElementById('user-info');
  const logoutBtn = document.getElementById('logout-btn');

  const superAdminForm = document.getElementById('form-superadmin');
  const userForm = document.getElementById('form-user');

  const serviceForm = document.getElementById('service-form');
  const imageUpload = document.getElementById('image-upload');
  const imagePreview = document.getElementById('image-preview');
  const serviceRecordsList = document.getElementById('service-records-list');
  const serviceHierarchy = document.getElementById('service-hierarchy');

  const saveSendBtn = document.getElementById('save-send-btn');
  const saveDraftBtn = document.getElementById('save-draft-btn');

  // Sample users for demo (username, password, role)
  let users = [
    { username: 'superadmin', password: '1234', role: 'superadmin', displayName: 'Süper Admin' },
    { username: 'distributor', password: '1234', role: 'turkiye-distributor', displayName: 'Türkiye Distribütörü' },
    { username: 'anabayi', password: '1234', role: 'ana-bayi', displayName: 'Ana Bayi' },
    { username: 'altbayi', password: '1234', role: 'alt-bayi', displayName: 'Alt Bayi' },
    { username: 'servis', password: '1234', role: 'yetkili-servis', displayName: 'Yetkili Servis' },
  ];

  // Yeni eklenen bayileri localStorage'dan yükle ve users dizisine ekle
  function loadDynamicUsers() {
    const bayiList = JSON.parse(localStorage.getItem('bayiList')) || [];
    bayiList.forEach(bayi => {
      // Eğer kullanıcı zaten yoksa ekle
      if (!users.some(u => u.username === bayi.id)) {
        users.push({
          username: bayi.id,
          password: bayi.password || '1234',
          role: bayi.type,
          displayName: bayi.name
        });
      }
    });
  }

  // Bayi listesi (ana bayi ve alt bayiler) demo için
  const bayiList = [
    { id: 'anabayi1', name: 'Ankara Kızılay Bayi', type: 'ana-bayi' },
    { id: 'altbayi1', name: 'Alt Bayi 1', type: 'alt-bayi', parentId: 'anabayi1' },
    { id: 'altbayi2', name: 'Alt Bayi 2', type: 'alt-bayi', parentId: 'anabayi1' },
    { id: 'anabayi2', name: 'İstanbul Bayi', type: 'ana-bayi' },
    { id: 'altbayi3', name: 'Alt Bayi 3', type: 'alt-bayi', parentId: 'anabayi2' },
  ];

  // Sidebar için bayi listesini kullan
  function getHierarchyData() {
    // bayiList içindeki ana bayi ve alt bayi hiyerarşisini oluştur
    const anaBayiler = bayiList.filter(bayi => bayi.type === 'ana-bayi');
    return anaBayiler.map(anaBayi => {
      const altBayiler = bayiList.filter(bayi => bayi.parentId === anaBayi.id);
      return {
        name: anaBayi.name,
        type: anaBayi.type,
        children: altBayiler.map(altBayi => {
          // Alt bayi altındaki yetkili servisleri ve personelleri ekle
          const yetkiliServisler = bayiList.filter(bayi => bayi.parentId === altBayi.id && bayi.type === 'yetkili-servis');
          return {
            name: altBayi.name,
            type: altBayi.type,
            children: yetkiliServisler.map(servis => {
              // Teknik servis personelleri için örnek veri, gerçek veriler eklenmeli
              const personeller = bayiList.filter(bayi => bayi.parentId === servis.id && bayi.type === 'person');
              return {
                name: servis.name,
                type: servis.type,
                children: personeller.map(person => ({
                  name: person.name,
                  type: person.type,
                  children: [],
                })),
              };
            }),
          };
        }),
      };
    });
  }

  // Check if user is logged in
  function checkLogin() {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (loggedUser) {
      if (loggedUser.role === 'superadmin') {
        showSuperAdminPanel(loggedUser);
      } else {
        populateBayiSelect(loggedUser);
        showAdminPanel(loggedUser);
      }
    } else {
      showLogin();
    }
  }

  // Populate bayi select dropdown based on user role
  function populateBayiSelect(user) {
    const bayiSelect = document.getElementById('bayi-select');
    bayiSelect.innerHTML = '<option value="">Seçiniz</option>';

    let filteredBayiler = [];

    if (user.role === 'superadmin' || user.role === 'turkiye-distributor') {
      filteredBayiler = bayiList;
    } else if (user.role === 'ana-bayi') {
      filteredBayiler = bayiList.filter(bayi => bayi.id === user.username || bayi.parentId === user.username);
    } else if (user.role === 'alt-bayi') {
      filteredBayiler = bayiList.filter(bayi => bayi.id === user.username);
    } else {
      filteredBayiler = [];
    }

    filteredBayiler.forEach(bayi => {
      const option = document.createElement('option');
      option.value = bayi.id;
      option.textContent = bayi.name;
      bayiSelect.appendChild(option);
    });
  }

  // Show login forms
  function showLogin() {
    loginContainer.style.display = 'block';
    adminPanel.style.display = 'none';
  }

  // Show admin panel
  function showAdminPanel(user) {
    loginContainer.style.display = 'none';
    adminPanel.style.display = 'flex';
    userInfo.textContent = user.displayName + ' (' + user.role + ')';

    // Bayi seçimi ve cari hesaplama alanlarını yetkiye göre göster
    if (['turkiye-distributor', 'ana-bayi'].includes(user.role)) {
      document.getElementById('bayi-selection-container').style.display = 'block';
      document.getElementById('cari-calculation-container').style.display = 'block';
    } else {
      document.getElementById('bayi-selection-container').style.display = 'none';
      document.getElementById('cari-calculation-container').style.display = 'none';
    }

    renderSidebar(user);
    renderServiceRecords(user);
  }

  // Logout
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('loggedUser');
    location.reload();
  });

  // Super Admin login
  superAdminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Do not call loadDynamicUsers here because superadmin is static user
    const username = document.getElementById('sa-username').value.trim();
    const password = document.getElementById('sa-password').value.trim();
    const user = users.find(u => u.username === username && u.password === password && u.role === 'superadmin');
    if (user) {
      localStorage.setItem('loggedUser', JSON.stringify(user));
      showAdminPanel(user);
    } else {
      alert('Geçersiz kullanıcı adı veya şifre.');
    }
  });

  // Other users login
  userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loadDynamicUsers();
    const username = document.getElementById('user-username').value.trim();
    const password = document.getElementById('user-password').value.trim();
    const role = document.getElementById('user-role').value;
    if (!role) {
      alert('Lütfen rol seçiniz.');
      return;
    }
    // If role is 'person', check if username and password match a person under any bayi
    if (role === 'person') {
      // Find person in bayiList
      const person = bayiList.find(bayi => bayi.type === 'person' && bayi.name === username);
      if (person && person.password === password) {
        // Create user object for person
        const user = {
          username: username,
          password: password,
          role: 'person',
          displayName: username,
          parentBayiId: person.parentId,
        };
        localStorage.setItem('loggedUser', JSON.stringify(user));
        showAdminPanel(user);
        return;
      } else {
        alert('Geçersiz kullanıcı adı veya şifre.');
        return;
      }
    }
    const user = users.find(u => u.username === username && u.password === password && u.role === role);
    if (user) {
      localStorage.setItem('loggedUser', JSON.stringify(user));
      showAdminPanel(user);
    } else {
      alert('Geçersiz kullanıcı adı, şifre veya rol.');
    }
  });

  // Render sidebar hierarchy based on user role
  function renderSidebar(user) {
    serviceHierarchy.innerHTML = '';
    let dataToShow = [];

    const hierarchyData = getHierarchyData();

    if (user.role === 'superadmin' || user.role === 'turkiye-distributor') {
      dataToShow = hierarchyData;
    } else if (user.role === 'ana-bayi') {
      dataToShow = hierarchyData.filter(bayi => bayi.type === 'ana-bayi' && bayi.name.toLowerCase().includes(user.username));
    } else if (user.role === 'alt-bayi') {
      // Alt bayi sadece kendi işlemlerini görebilir
      dataToShow = hierarchyData.flatMap(bayi => bayi.children || []).filter(child => child.name.toLowerCase().includes(user.username));
    } else if (user.role === 'yetkili-servis') {
      // Yetkili servis sadece kendi servislerini görebilir
      dataToShow = [];
    } else if (user.role === 'person') {
      // Person sadece kendi servislerini görebilir
      // Bulunduğu servis ve alt bayi hiyerarşisini göster
      const personBayi = bayiList.find(bayi => bayi.type === 'person' && bayi.name === user.username);
      if (personBayi) {
        const servis = bayiList.find(bayi => bayi.id === personBayi.parentId);
        const altBayi = bayiList.find(bayi => bayi.id === servis.parentId);
        const anaBayi = bayiList.find(bayi => bayi.id === altBayi.parentId);
        dataToShow = [{
          name: anaBayi.name,
          type: anaBayi.type,
          children: [{
            name: altBayi.name,
            type: altBayi.type,
            children: [{
              name: servis.name,
              type: servis.type,
              children: [{
                name: personBayi.name,
                type: personBayi.type,
                children: []
              }]
            }]
          }]
        }];
      }
    }

    dataToShow.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.name;
      serviceHierarchy.appendChild(li);
      if (item.children) {
        const ulChild = document.createElement('ul');
        ulChild.style.paddingLeft = '15px';
        item.children.forEach(child => {
          const liChild = document.createElement('li');
          liChild.textContent = child.name;
          ulChild.appendChild(liChild);
        });
        serviceHierarchy.appendChild(ulChild);
      }
    });
  }

  // Handle image preview
  imageUpload.addEventListener('change', () => {
    const file = imageUpload.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.innerHTML = '<img src="' + e.target.result + '" alt="Resim Önizleme" style="max-width: 100%; max-height: 150px;"/>';
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.textContent = 'Henüz resim seçilmedi.';
    }
  });

  // Save service record to localStorage
  function saveServiceRecord(record) {
    let records = JSON.parse(localStorage.getItem('serviceRecords')) || [];
    records.push(record);
    localStorage.setItem('serviceRecords', JSON.stringify(records));
  }

  // Render service records list based on user role
  function renderServiceRecords(user) {
    serviceRecordsList.innerHTML = '';
    let records = JSON.parse(localStorage.getItem('serviceRecords')) || [];

    if (user.role === 'superadmin' || user.role === 'turkiye-distributor') {
      // Bayi seçimine göre filtrele
      const selectedBayi = document.getElementById('bayi-select').value;
      if (selectedBayi) {
        records = records.filter(r => r.bayiId === selectedBayi);
      }
    } else if (user.role === 'ana-bayi') {
      const selectedBayi = document.getElementById('bayi-select').value;
      if (selectedBayi) {
        records = records.filter(r => r.bayiId === selectedBayi);
      } else {
        records = records.filter(r => r.createdByRole === 'ana-bayi');
      }
    } else if (user.role === 'alt-bayi') {
      records = records.filter(r => r.bayiId === user.username);
    } else if (user.role === 'yetkili-servis') {
      records = records.filter(r => r.createdByRole === 'yetkili-servis');
    }

    if (records.length === 0) {
      serviceRecordsList.innerHTML = '<li>Hiç servis kaydı bulunamadı.</li>';
      return;
    }

    records.forEach(record => {
      const li = document.createElement('li');
      li.innerHTML = '#'+record.id+' - '+record.date+' <br/>' +
        '<strong>'+record.customerName+'</strong> — '+record.deviceModel+' <br/>' +
        'Problem: '+record.problemDescription+' <br/>' +
        'Satma: ₺'+(record.priceSale ? record.priceSale.toFixed(2) : '0.00')+' <br/>' +
        'Alma: ₺'+(record.pricePurchase ? record.pricePurchase.toFixed(2) : '0.00')+' <br/>' +
        'Tamir: ₺'+(record.priceRepair ? record.priceRepair.toFixed(2) : '0.00')+' <br/>' +
        'Kaydı açan: '+record.createdBy;
      serviceRecordsList.appendChild(li);
    });
  }

  // Generate unique ID
  function generateId() {
    return Date.now().toString();
  }

  // Handle service form submit
  serviceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (!loggedUser) {
      alert('Lütfen giriş yapınız.');
      return;
    }

    const customerName = document.getElementById('customer-name').value.trim();
    const deviceBrand = document.getElementById('device-brand').value;
    const deviceModel = document.getElementById('device-model').value.trim();
    const problemDescription = document.getElementById('problem-description').value.trim();
    const warranty = document.getElementById('warranty').value;
    const priceSale = parseFloat(document.getElementById('price-sale').value) || 0;
    const pricePurchase = parseFloat(document.getElementById('price-purchase').value) || 0;
    const priceRepair = parseFloat(document.getElementById('price-repair').value) || 0;
    const date = new Date().toLocaleString();

    // Bayi seçimi (admin, süper admin, bölge müdürü için)
    let selectedBayi = null;
    if (['superadmin', 'turkiye-distributor', 'ana-bayi'].includes(loggedUser.role)) {
      selectedBayi = document.getElementById('bayi-select').value;
      if (!selectedBayi) {
        alert('Lütfen bir bayi seçiniz.');
        return;
      }
    } else {
      selectedBayi = loggedUser.username; // Alt bayi kendi kullanıcı adı ile filtrelenir
    }

    // Image data as base64
    let imageData = null;
    const file = imageUpload.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        imageData = event.target.result;
        saveRecord();
      };
      reader.readAsDataURL(file);
    } else {
      saveRecord();
    }

    function saveRecord() {
      const record = {
        id: generateId(),
        date,
        customerName,
        deviceBrand,
        deviceModel,
        problemDescription,
        warranty,
        priceSale,
        pricePurchase,
        priceRepair,
        imageData,
        createdBy: loggedUser.displayName,
        createdByRole: loggedUser.role,
        bayiId: selectedBayi,
      };
      saveServiceRecord(record);
      alert('Servis kaydı başarıyla kaydedildi.');
      serviceForm.reset();
      imagePreview.textContent = 'Henüz resim seçilmedi.';
      renderServiceRecords(loggedUser);
    }
  });

  // Save draft button (just save without alert)
  saveDraftBtn.addEventListener('click', () => {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (!loggedUser) {
      alert('Lütfen giriş yapınız.');
      return;
    }

    const customerName = document.getElementById('customer-name').value.trim();
    const deviceBrand = document.getElementById('device-brand').value;
    const deviceModel = document.getElementById('device-model').value.trim();
    const problemDescription = document.getElementById('problem-description').value.trim();
    const warranty = document.getElementById('warranty').value;
    const date = new Date().toLocaleString();

    let imageData = null;
    const file = imageUpload.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        imageData = event.target.result;
        saveDraft();
      };
      reader.readAsDataURL(file);
    } else {
      saveDraft();
    }

    function saveDraft() {
      const record = {
        id: generateId(),
        date,
        customerName,
        deviceBrand,
        deviceModel,
        problemDescription,
        warranty,
        priceSale,
        pricePurchase,
        priceRepair,
        imageData,
        createdBy: loggedUser.displayName,
        createdByRole: loggedUser.role,
        bayiId: selectedBayi,
        draft: true,
      };
      saveServiceRecord(record);
      serviceForm.reset();
      imagePreview.textContent = 'Henüz resim seçilmedi.';
      renderServiceRecords(loggedUser);
    }
  });

  // Handle calculate from records button
  document.getElementById('calculate-from-records-btn').addEventListener('click', () => {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (!loggedUser) {
      alert('Lütfen giriş yapınız.');
      return;
    }
    let records = JSON.parse(localStorage.getItem('serviceRecords')) || [];
    // Filter based on user role
    if (loggedUser.role === 'superadmin' || loggedUser.role === 'turkiye-distributor') {
      const selectedBayi = document.getElementById('bayi-select').value;
      if (selectedBayi) {
        records = records.filter(r => r.bayiId === selectedBayi);
      }
    } else if (loggedUser.role === 'ana-bayi') {
      const selectedBayi = document.getElementById('bayi-select').value;
      if (selectedBayi) {
        records = records.filter(r => r.bayiId === selectedBayi);
      } else {
        records = records.filter(r => r.createdByRole === 'ana-bayi');
      }
    } else if (loggedUser.role === 'alt-bayi') {
      records = records.filter(r => r.bayiId === loggedUser.username);
    } else if (loggedUser.role === 'yetkili-servis') {
      records = records.filter(r => r.createdByRole === 'yetkili-servis');
    }
    let totalGelir = 0;
    let totalGider = 0;
    records.forEach(record => {
      totalGelir += record.priceSale || 0;
      totalGider += (record.pricePurchase || 0) + (record.priceRepair || 0);
    });
    document.getElementById('gelir').value = totalGelir.toFixed(2);
    document.getElementById('gider').value = totalGider.toFixed(2);
  });

  // Handle cari form submit
  document.getElementById('cari-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const gelir = parseFloat(document.getElementById('gelir').value) || 0;
    const gider = parseFloat(document.getElementById('gider').value) || 0;
    const bakiye = gelir - gider;
    document.getElementById('cari-result').innerHTML = 'Bakiye: ₺' + bakiye.toFixed(2);
    document.getElementById('cari-gonder-btn').style.display = 'block';
  });

  // Quick action buttons (for demo, just alert)
  document.getElementById('view-dealers-btn').addEventListener('click', () => {
    alert('Tüm bayiler görüntülenecek (demo).');
  });
  document.getElementById('manage-payments-btn').addEventListener('click', () => {
    alert('Ödemeler yönetilecek (demo).');
  });
  document.getElementById('settings-btn').addEventListener('click', () => {
    alert('Ayarlar sayfası (demo).');
  });

  // Show super admin panel
  function showSuperAdminPanel(user) {
    loginContainer.style.display = 'none';
    adminPanel.style.display = 'flex';
    userInfo.textContent = user.displayName + ' (' + user.role + ')';

    // Süper admin için bayi yönetim formu göster
    document.getElementById('bayi-management').style.display = 'block';

    // Diğer modüller gizlenebilir (örnek: hızlı işlemler)
    document.getElementById('quick-actions').style.display = 'none';

    renderSidebar(user);
    renderServiceRecords(user);
  }

  // Handle add bayi form submit
  const formAddBayi = document.getElementById('form-add-bayi');
  formAddBayi.addEventListener('submit', (e) => {
    e.preventDefault();

    const region = document.getElementById('region').value.trim();
    const city = document.getElementById('city').value.trim();
    const bayiName = document.getElementById('bayi-name').value.trim();
    const parentBayiId = document.getElementById('parent-bayi').value;
    const email = document.getElementById('bayi-email').value.trim();
    const password = document.getElementById('bayi-password').value;

    if (!region || !city || !bayiName || !email || !password) {
      alert('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    // Yeni bayi id oluştur (örnek: bayi adı küçük harf ve boşluk yerine tire)
    const newBayiId = bayiName.toLowerCase().replace(/\s+/g, '-');

    // Yeni bayi objesi oluştur
    const newBayi = {
      id: newBayiId,
      name: bayiName,
      type: parentBayiId ? 'alt-bayi' : 'ana-bayi',
      parentId: parentBayiId || null,
      region,
      city,
      email,
      password,
    };

    // Bayi listesine ekle
    bayiList.push(newBayi);

    // Kullanıcı listesine ekle
    users.push({
      username: newBayiId,
      password,
      role: newBayi.type,
      displayName: bayiName,
    });

    // Parent bayi select güncelle
    updateParentBayiSelect();

    alert('Yeni bayi başarıyla eklendi.');

    formAddBayi.reset();
  });

  // Update parent bayi select options
  function updateParentBayiSelect() {
    const parentSelect = document.getElementById('parent-bayi');
    parentSelect.innerHTML = '<option value="">Yok</option>';
    bayiList.filter(bayi => bayi.type === 'ana-bayi').forEach(bayi => {
      const option = document.createElement('option');
      option.value = bayi.id;
      option.textContent = bayi.name;
      parentSelect.appendChild(option);
    });
  }

  // Initialize parent bayi select on load
  updateParentBayiSelect();

  checkLogin();
});
