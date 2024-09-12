document.getElementById('oyForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Formun otomatik olarak gönderilmesini engelle

    const adSoyad = document.getElementById('adSoyad').value;
    const oylar = document.getElementById('oylar').value.split(',').map(oy => oy.trim()); // Oyları virgülle ayır ve boşlukları temizle

    // Oy kullanma isteği gönder
    try {
        const response = await fetch('/oy-kullan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ adSoyad, oylar })
        });
        const data = await response.json();

        if (response.ok) {
            alert(data.message); // Oy başarıyla kaydedildi mesajını göster
            oySonuclariniGetir(); // Oy sonuçlarını güncelle
        } else {
            alert(data.error); // Hata mesajını göster
        }
    } catch (error) {
        console.error('Oy kullanırken hata:', error);
    }
});

// Oy sonuçlarını getirme
async function oySonuclariniGetir() {
    try {
        const response = await fetch('/oylar');
        const oylar = await response.json();

        const oySonuclari = document.getElementById('oySonuclari');
        oySonuclari.innerHTML = ''; // Mevcut listeyi temizle

        oylar.forEach(oy => {
            const li = document.createElement('li');
            li.textContent = `Ad Soyad: ${oy.adSoyad}, Oylar: ${oy.oylar.join(', ')}`;
            oySonuclari.appendChild(li);
        });
    } catch (error) {
        console.error('Oy sonuçları getirilirken hata:', error);
    }
}

// Sayfa yüklendiğinde oy sonuçlarını getir
document.addEventListener('DOMContentLoaded', oySonuclariniGetir);
