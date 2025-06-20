# HIS: Haptik İnteraktif Eğitim Sistemi

Bu proje, görme engelliler için tasarlanmış bir yapay zeka öğretmeni uygulamasıdır. Uygulama, öğrencilere konuları sesli olarak açıklamakta ve ardından Braille alfabesi kullanarak matematiksel ifadeleri 18x18 boyutunda bir matris içinde göstermektedir.

## Özellikler

- **Sesli Açıklama**: Yapay zeka sohbeti ile sesli, canlı ve dinamik bir öğrenme deneyimi yaşanabilir.
- **Braille Desteği**: Matematiksel ifadeler Braille formatında gösterilir.
- **Kullanıcı Dostu Arayüz**: Kullanıcıların kolayca etkileşimde bulunabilmesi için tasarlanmıştır.
- **Notlar**: Not kaydedilebilir, düzenlenebilir, silinebilir, okunabilir.
- **PDF -> Not Desteği**: PDF formatında belgeler braille notlarına dönüştürür.
- **Ders Kayıtları**: Zaman damgalı ders kayıtları alınabilir ve sonradan dinlenebilir.

## Kurulum

1. **Gereksinimler**:
   - Node.js
   - Python 3.x
   - PostgreSQL

2. **Proje Klasörüne Git**:
   ```bash
   cd proje_adi
   ```

3. **Bağımlılıkları Yükle**:
   ```bash
   npm install
   ```

4. **Python Bağımlılıklarını Yükle**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Veritabanı Ayarları**:
   - `DATABASE_URL` ortam değişkenini ayarlayın.

6. **Uygulamayı Başlat**:
   ```bash
   npm run dev
   ```

## Kullanım

- Uygulama açıldığında, kullanıcılar yapay zeka ile etkileşime geçebilir.
- Kullanıcılar, matematiksel ifadeleri yazabilir ve yapay zeka bu ifadeleri Braille formatında gösterecektir.

## Katkıda Bulunma

Katkıda bulunmak isterseniz, lütfen bir pull request oluşturun veya sorunları bildirin.

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## Başarılar

Bu proje 56. TÜBİTAK 2204-A Lise Araştırma ve Proje Yarışmasında Türkiye İkinciliği ödülünü kazanmıştır.