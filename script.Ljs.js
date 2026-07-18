function toggleNavigationMenu() {
  const navigationMenu = document.getElementById('navigationPopupMenu');
  navigationMenu.classList.toggle('open');
}

function toggleChatPopup() {
  const overlay = document.getElementById('chatPopupOverlay');
  if (overlay.style.display === 'flex') {
    overlay.style.display = 'none';
  } else {
    overlay.style.display = 'flex';
  }
}

function validateAndCheckData() {
  const identityNumberInput = document.getElementById('identityNumber');
  const serviceCodeInput = document.getElementById('serviceCode');
  const identityNumber = identityNumberInput.value.trim();
  const serviceCode = serviceCodeInput.value.trim();
  const emptyFieldsErrorMessage = document.getElementById('emptyFieldsErrorMessage');
  const searchButton = document.getElementById('searchButton');
  const loadingSpinnerElement = document.getElementById('loadingSpinnerElement');
  const errorMessageTab = document.getElementById("errorMessageTab");
  const resultsDisplayBox = document.getElementById("resultsDisplayBox");
  const serviceCodeContainer = document.getElementById('serviceCodeContainer');
  const identityNumberContainer = document.getElementById('identityNumberContainer');

  if (!identityNumber || !serviceCode) {
    emptyFieldsErrorMessage.style.display = 'block';
    serviceCodeContainer.style.marginTop = '5px'; 
    identityNumberContainer.style.marginTop = '5px'; 
    errorMessageTab.style.display = 'none';
    resultsDisplayBox.style.display = 'none';
    return;
  } else {
    emptyFieldsErrorMessage.style.display = 'none';
    serviceCodeContainer.style.marginTop = ''; 
    identityNumberContainer.style.marginTop = ''; 
  }

  loadingSpinnerElement.style.display = 'inline-block';
  searchButton.classList.add('loading');
  searchButton.disabled = true;
  errorMessageTab.style.display = "none"; 
  resultsDisplayBox.style.display = "none";

  // Create FormData to send to PHP
  const formData = new FormData();
  formData.append('identityNumber', identityNumber);
  formData.append('serviceCode', serviceCode);

  fetch('check_data.php', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(result => {
    loadingSpinnerElement.style.display = 'none';
    searchButton.classList.remove('loading');
    searchButton.disabled = false;

    if (result.success) {
      const searchResult = result.data;
      resultsDisplayBox.innerHTML = `
        <div class="information-label text-bold">الاسم</div><div class="information-data text-normal">${searchResult.name}</div>
        <div class="information-label text-bold">تاريخ إصدار تقرير الاجازة</div><div class="information-data text-normal">${searchResult.date}</div>
        <div class="information-label text-bold">تبدأ من</div><div class="information-data text-normal">${searchResult.from}</div>
        <div class="information-label text-bold">وحتى</div><div class="information-data text-normal">${searchResult.to}</div>
        <div class="information-label text-bold">المدة بالأيام</div><div class="information-data text-normal">${searchResult.days}</div>
        <div class="information-label text-bold">اسم الطبيب</div><div class="information-data text-normal">${searchResult.doctor}</div>
        <div class="information-label text-bold">المسمى الوظيفي</div><div class="information-data text-normal">${searchResult.title}</div>
      `;
      resultsDisplayBox.style.display = "block";
      errorMessageTab.style.display = "none";
      document.getElementById('searchButton').style.display = 'none';
      document.getElementById('backButton').style.display = 'none';
      document.getElementById('newSearchButton').style.display = 'block';
      document.getElementById('backToListButton').style.display = 'block';
    } else {
      resultsDisplayBox.style.display = "none";
      errorMessageTab.style.display = "block";
      document.getElementById('searchButton').style.display = 'block'; 
      document.getElementById('backButton').style.display = 'block';
      document.getElementById('newSearchButton').style.display = 'none';
      document.getElementById('backToListButton').style.display = 'none';
    }
  })
  .catch(error => {
    console.error('Error:', error);
    loadingSpinnerElement.style.display = 'none';
    searchButton.classList.remove('loading');
    searchButton.disabled = false;
    errorMessageTab.textContent = "حدث خطأ في الاتصال بالخادم";
    errorMessageTab.style.display = "block";
  });
}

function hideEmptyFieldError() {
  const emptyFieldsErrorMessage = document.getElementById('emptyFieldsErrorMessage');
  const serviceCodeContainer = document.getElementById('serviceCodeContainer');
  const identityNumberContainer = document.getElementById('identityNumberContainer');
  if (emptyFieldsErrorMessage.style.display === 'block') {
      emptyFieldsErrorMessage.style.display = 'none';
      serviceCodeContainer.style.marginTop = ''; 
      identityNumberContainer.style.marginTop = ''; 
  }
}

function resetFormToInitialState() {
  const searchButton = document.getElementById('searchButton');
  document.getElementById('identityNumber').value = '';
  document.getElementById('serviceCode').value = '';
  document.getElementById('errorMessageTab').style.display = 'none';
  document.getElementById('emptyFieldsErrorMessage').style.display = 'none';
  document.getElementById('resultsDisplayBox').style.display = 'none';
  document.getElementById('searchButton').style.display = 'block';
  document.getElementById('backButton').style.display = 'block';
  document.getElementById('newSearchButton').style.display = 'none';
  document.getElementById('backToListButton').style.display = 'none';
  document.getElementById('loadingSpinnerElement').style.display = 'none';
  searchButton.classList.remove('loading');
  searchButton.disabled = false;
  document.getElementById('serviceCodeContainer').style.marginTop = ''; 
  document.getElementById('identityNumberContainer').style.marginTop = ''; 
}

function performNewSearch() {
  resetFormToInitialState();
}

window.addEventListener('load', () => {
  document.getElementById('mainHeader').classList.add('show');
  resetFormToInitialState();
});
