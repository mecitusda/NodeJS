const {Ogrenci,OgrenciSayac}= require('../models/ogrenci.js');
const express = require('express');
const Sequelize = require('sequelize')
const App = express();
var count=0;
var sayac=0;

App.listen(4000, () => {
  console.log(`Sunucu ${4000} numaralı porta başarıyla bağlandı.`);
});

App.use(express.json());

App.post('/ogrenci', async (req, res) => {
   
    try {
        
        const { name, email, dept_id } = req.body;
        
        
        if (!name || !email || !dept_id ) {
            console.log("tüm değerleri girin.")
            return res.status(400).send('Lütfen tüm değerleri giriniz');
        }
        
            
       
        const satir_sayisi = await OgrenciSayac.count();
        if(satir_sayisi===0){
        
                const satir_olustur=await OgrenciSayac.create(0)
                await OgrenciSayac.update({ sayac: Sequelize.literal('sayac + 1') }, {
                    where: {} 
                });
                sayac++
                
        }else{
            const record = await OgrenciSayac.findOne();
            sayac=record.sayac+1;
            
            await OgrenciSayac.update({ sayac: Sequelize.literal('sayac + 1') }, {
                where: {} 
            });
            
        }
        const ogrenci = await Ogrenci.create({name, email, dept_id, counter:sayac  });
        
        console.log(ogrenci)
        res.status(201).json(ogrenci);
        


    } catch (error) {
        console.error(error);
        console.log(error)
        res.status(500).send('İşlem başarısız oldu');
    }
    
    console.log("işlem bitti.");
});





App.delete('/ogrenci', async (req, res) => {
    const userId = parseInt(req.body.id);
    try {
        console.log("2 çalıştı")
        if (!userId) {
            return res.status(400).send('Lütfen tüm değerleri giriniz');
        }
        const ogrenci = await Ogrenci.findByPk(userId)

        if (ogrenci == null) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        await ogrenci.destroy()
        await OgrenciSayac.update({ sayac: Sequelize.literal('sayac - 1') }, {
            where: {} // Belirli bir id ile satırı güncelle
        });
        res.status(200).json({ message: 'Kullanıcı başarıyla silindi' });

    } catch (error) {
        console.error(error);
        res.status(500).send('İşlem başarısız oldu')
    }
});

App.put('/ogrenci', async (req, res) => {
   
    const userId = parseInt(req.body.id)
    console.log(req.body)
    try {
        const { name, email } = req.body

        if (!userId || !name || !email) {
            return res.status(400).send('Lütfen tüm değerleri giriniz');
        }

        const ogrenci = await Ogrenci.findByPk(userId)

        if (ogrenci == null) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        await ogrenci.update({ name: name, email: email })
        res.status(201).json(ogrenci);

    } catch (e) {
        console.error(error);
        res.status(500).send('İşlem başarısız oldu');
    }
   
})



module.exports = App;