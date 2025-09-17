// bayi-management.js
// Rol bazlı içerik yönetimi ve süper admin için bayi seçip o bayi görünümüne geçme fonksiyonları

document.addEventListener('DOMContentLoaded', () => {
  const serviceHierarchy = document.getElementById('service-hierarchy');
  const serviceRecordsList = document.getElementById('service-records-list');
  const userInfo = document.getElementById('user-info');

  // Local storage'dan kullanıcı ve seçilen bayi bilgisi al
  let loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
  let selectedBayi = JSON.parse(localStorage.getItem('selectedBayi')) || null;

  // Örnek hiyerarşi verisi
  const hierarchyData = [
    {
      region: 'Ankara',
      cities: [
        {
          city: 'Kızılay',
          dealers: [
            {
              name: 'Ankara Kızılay Bayi',
              altBayiler: [
                {
                  name: 'Alt Bayi 1',
                  yetkiliServisler: [
                    { name: 'Yetkili Servis 1' },
                    { name: 'Yetkili Servis 2' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      region: 'İstanbul',
      cities: [
        {
          city: 'Kadıköy',
          dealers: [
            {
              name: 'İstanbul Kadıköy Bayi',
              altBayiler: [
                {
                  name: 'Alt Bayi 2',
                  yetkiliServisler: [
                    { name: 'Yetkili Servis 3' }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  // Menü oluşturma fonksiyonu (accordion tarzı)
  function createMenu() {
    serviceHierarchy.innerHTML = '';

    if (!loggedUser) return;

    // Süper admin ve distribütör için tüm hiyerarşi gösterilir
    if (loggedUser.role === 'superadmin' || loggedUser.role === 'turkiye-distributor') {
      hierarchyData.forEach(region => {
        const regionLi = document.createElement('li');
        regionLi.textContent = region.region;
        regionLi.classList.add('accordion-item');

        const cityUl = document.createElement('ul');
        cityUl.classList.add('nested-list');

        region.cities.forEach(city => {
          const cityLi = document.createElement('li');
          cityLi.textContent = city.city;
          cityLi.classList.add('accordion-item');

          const dealerUl = document.createElement('ul');
          dealerUl.classList.add('nested-list');

          city.dealers.forEach(dealer => {
            const dealerLi = document.createElement('li');
            dealerLi.textContent = dealer.name;
            dealerLi.classList.add('accordion-item');
            dealerLi.dataset.type = 'dealer';
            dealerLi.dataset.name = dealer.name;

            const altBayiUl = document.createElement('ul');
            altBayiUl.classList.add('nested-list');

            dealer.altBayiler.forEach(altBayi => {
              const altBayiLi = document.createElement('li');
              altBayiLi.textContent = altBayi.name;
              altBayiLi.classList.add('accordion-item');
              altBayiLi.dataset.type = 'alt-bayi';
              altBayiLi.dataset.name = altBayi.name;

              const servisUl = document.createElement('ul');
              servisUl.classList.add('nested-list');

              altBayi.yetkiliServisler.forEach(servis => {
                const servisLi = document.createElement('li');
                servisLi.textContent = servis.name;
                servisLi.classList.add('accordion-item');
                servisLi.dataset.type = 'yetkili-servis';
                servisLi.dataset.name = servis.name;

                servisUl.appendChild(servisLi);
              });

              altBayiLi.appendChild(servisUl);
              altBayiUl.appendChild(altBayiLi);
            });

            dealerLi.appendChild(altBayiUl);
            dealerUl.appendChild(dealerLi);
          });

          cityLi.appendChild(dealerUl);
          cityUl.appendChild(cityLi);
        });

        regionLi.appendChild(cityUl);
        serviceHierarchy.appendChild(regionLi);
      });
    } else if (loggedUser.role === 'ana-bayi') {
      // Ana bayi için sadece kendi alt bayileri ve yetkili servisler gösterilir
      // Örnek: loggedUser.username ile eşleşen bayi bulunur ve onun alt bayileri gösterilir
      // Burada demo amaçlı tüm alt bayiler gösteriliyor
      hierarchyData.forEach(region => {
        region.cities.forEach(city => {
          city.dealers.forEach(dealer => {
            if (dealer.name.toLowerCase().includes(loggedUser.username)) {
              const dealerLi = document.createElement('li');
              dealerLi.textContent = dealer.name;
              dealerLi.classList.add('accordion-item');
              dealerLi.dataset.type = 'dealer';
              dealerLi.dataset.name = dealer.name;

              const altBayiUl = document.createElement('ul');
              altBayiUl.classList.add('nested-list');

              dealer.altBayiler.forEach(altBayi => {
                const altBayiLi = document.createElement('li');
                altBayiLi.textContent = altBayi.name;
                altBayiLi.classList.add('accordion-item');
                altBayiLi.dataset.type = 'alt-bayi';
                altBayiLi.dataset.name = altBayi.name;

                const servisUl = document.createElement('ul');
                servisUl.classList.add('nested-list');

                altBayi.yetkiliServisler.forEach(servis => {
                  const servisLi = document.createElement('li');
                  servisLi.textContent = servis.name;
                  servisLi.classList.add('accordion-item');
                  servisLi.dataset.type = 'yetkili-servis';
                  servisLi.dataset.name = servis.name;

                  servisUl.appendChild(servisLi);
                });

                altBayiLi.appendChild(servisUl);
                altBayiUl.appendChild(altBayiLi);
              });

              dealerLi.appendChild(altBayiUl);
              serviceHierarchy.appendChild(dealerLi);
            }
          });
        });
      });
    } else if (loggedUser.role === 'alt-bayi') {
      // Alt bayi için sadece kendi yetkili servisleri gösterilir
      // Demo amaçlı tüm yetkili servisler gösteriliyor
      hierarchyData.forEach(region => {
        region.cities.forEach(city => {
          city.dealers.forEach(dealer => {
            dealer.altBayiler.forEach(altBayi => {
              if (altBayi.name.toLowerCase().includes(loggedUser.username)) {
                altBayi.yetkiliServisler.forEach(servis => {
                  const servisLi = document.createElement('li');
                  servisLi.textContent = servis.name;
                  servisLi.classList.add('accordion-item');
                  servisLi.dataset.type = 'yetkili-servis';
                  servisLi.dataset.name = servis.name;

                  serviceHierarchy.appendChild(servisLi);
                });
              }
            });
          });
        });
      });
    } else if (loggedUser.role === 'yetkili-servis') {
      // Yetkili servis için sadece kendi adı gösterilir
      const servisLi = document.createElement('li');
      servisLi.textContent = loggedUser.displayName;
      servisLi.classList.add('accordion-item');
      servisLi.dataset.type = 'yetkili-servis';
      servisLi.dataset.name = loggedUser.displayName;
      serviceHierarchy.appendChild(servisLi);
    }

    // Accordion aç/kapa işlevi
    const accItems = document.querySelectorAll('.accordion-item');
    accItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const nextUl = item.querySelector('ul');
        if (nextUl) {
          nextUl.style.display = nextUl.style.display === 'block' ? 'none' : 'block';
        }
        // Seçilen bayi/servis bilgisini localStorage'a kaydet
        if (item.dataset.type) {
          selectedBayi = { type: item.dataset.type, name: item.dataset.name };
          localStorage.setItem('selectedBayi', JSON.stringify(selectedBayi));
          renderServiceRecords(selectedBayi);
        }
      });
    });
  }

  // Servis kayıtlarını render etme (demo amaçlı)
  function renderServiceRecords(selected) {
    serviceRecordsList.innerHTML = '';
    if (!selected) {
      serviceRecordsList.innerHTML = '<li>Lütfen soldan bir bayi veya servis seçin.</li>';
      return;
    }

    // Demo veri: seçilen bayi/servis adına göre filtrelenmiş kayıtlar
    const allRecords = JSON.parse(localStorage.getItem('serviceRecords')) || [];
    const filteredRecords = allRecords.filter(r => r.bayiName === selected.name);

    if (filteredRecords.length === 0) {
      serviceRecordsList.innerHTML = '<li>Seçilen bayi/servis için kayıt bulunamadı.</li>';
      return;
    }

      filteredRecords.forEach(record => {
      const li = document.createElement('li');
      li.innerHTML = '#'+record.id+' - '+record.date+' <br/>' +
        '<strong>'+record.customerName+'</strong> — '+record.deviceModel+' <br/>' +
        'Problem: '+record.problemDescription+' <br/>' +
        'Kaydı açan: '+record.createdBy;
      serviceRecordsList.appendChild(li);
    });
  }

  // Başlangıçta menüyü oluştur
  createMenu();

  // Eğer süper admin ise ve bayi seçtiyse, o bayi görünümüne geçiş yapılabilir
  if (loggedUser && loggedUser.role === 'superadmin' && selectedBayi) {
    renderServiceRecords(selectedBayi);
  }
});
