// js/data.js

const deliveryData = [
    // Slot 1
    { slot: 1, name: 'Ney', order: 5000, send: 3390 },
    { slot: 1, name: 'Aelia', order: 900, send: 560 }, // Ini adalah Rezz yang sebelumnya bernama Aelia (900 order)
    { slot: 1, name: 'Rezz', order: 150, send: 60 },  // Ini adalah Rezz baru dengan order 150
    { slot: 1, name: 'Aya', order: 860, send: 500 },
    { slot: 1, name: 'Anna', order: 1080, send: 220 },

    // Slot 2
    { slot: 2, name: 'Angel2', order: 600, send: 540, statusOverride: 'fail' },
    { slot: 2, name: 'Autumn', order: 850, send: 230, statusOverride: 'fail' },
    { slot: 2, name: 'Alana', order: 320, send: 160 },
    { slot: 2, name: 'Ryu', order: 320, send: 100 },
    { slot: 2, name: 'Rachel', order: 400, send: 100 },
    { slot: 2, name: 'Honey bear', order: 1400, send: 100 },

    // Slot 3
    { slot: 3, name: 'Zee', order: 400, send: 220 },
    { slot: 3, name: 'Diyy', order: 640, send: 400 },
    { slot: 3, name: 'Aze', order: 570, send: 400, statusOverride: 'fail' },
    { slot: 3, name: 'Al', order: 320, send: 280, statusOverride: 'fail' }, // Status ❌ ditambahkan kembali
    { slot: 3, name: 'Sena', order: 570, send: 460, statusOverride: 'fail' }, // Status ❌ ditambahkan
    { slot: 3, name: 'Idnes', order: 320, send: 230 },
    { slot: 3, name: 'Luna', order: 800, send: 731, statusOverride: 'fail' },
    { slot: 3, name: 'Kai', order: 220, send: 200 },
    { slot: 3, name: 'Rei', order: 220, send: 200, statusOverride: 'fail' }, // Status ❌ ditambahkan

    // Riwayat Orderan Selesai
    { slot: 'completed', name: 'Ave', order: 220, send: 220 }, // Dipindahkan dari Slot 2
    { slot: 'completed', name: 'Raine', order: 420, send: 420 },
    { slot: 'completed', name: 'Araba', order: 150, send: 150 },
    // { slot: 'completed', name: 'Rezz', order: 40, send: 40 }, // Rezz order 40 dihapus sesuai data baru Anda
    { slot: 'completed', name: 'Nayla', order: 530, send: 530 },
    { slot: 'completed', name: 'Rani', order: 320, send: 320 },
    { slot: 'completed', name: 'Purili', order: 320, send: 320 },
    { slot: 'completed', name: 'Rain', order: 320, send: 320 },
    { slot: 'completed', name: 'Alip', order: 320, send: 320 },
    { slot: 'completed', name: 'Anggi', order: 320, send: 320 },
    { slot: 'completed', name: 'Hira', order: 360, send: 377 },
    { slot: 'completed', name: 'Amanda', order: 80, send: 80 },
    { slot: 'completed', name: 'bulilisso', order: 80, send: 80 },
    { slot: 'completed', name: 'Tsabyy', order: 200, send: 200 },
    { slot: 'completed', name: 'Harbie', order: 200, send: 200 },
    { slot: 'completed', name: 'Fida', order: 100, send: 103 },
    { slot: 'completed', name: 'Vyan', order: 80, send: 83 },
    { slot: 'completed', name: 'Ayu', order: 1000, send: 1003 },
    { slot: 'completed', name: 'Anna', order: 600, send: 603 },
    { slot: 'completed', name: 'Zee', order: 150, send: 153 },
    { slot: 'completed', name: 'Nanda', order: 210, send: 213 },
    { slot: 'completed', name: 'Alvin', order: 210, send: 213 },
    { slot: 'completed', name: 'Ira', order: 150, send: 153 },
    { slot: 'completed', name: 'Kael', order: 120, send: 123 },
    { slot: 'completed', name: 'Xen', order: 210, send: 213 },
    { slot: 'completed', name: 'Lusi', order: 600, send: 603 },
    { slot: 'completed', name: 'Sea', order: 150, send: 157 }
];
        
