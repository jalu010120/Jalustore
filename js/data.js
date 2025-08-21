// js/data.js

const deliveryData = [
    // Slot 1
    { slot: 1, name: 'Ney', order: 5000, send: 3830, statusOverride: 'fail' },
    { slot: 1, name: 'Aelia', order: 1900, send: 1100, statusOverride: 'fail' },
    { slot: 1, name: 'Anna', order: 1080, send: 820, statusOverride: 'fail' }, // Status ❌ ditambahkan
    { slot: 1, name: 'Tuna 2', order: 360, send: 280, statusOverride: 'fail' },
    { slot: 1, name: 'Unii', order: 400, send: 340, statusOverride: 'fail' }, // Status ❌ ditambahkan
    { slot: 1, name: 'Archa', order: 460, send: 360, statusOverride: 'fail' }, // Status ❌ ditambahkan
    { slot: 1, name: 'Zel', order: 340, send: 240, statusOverride: 'fail' }, // Status ❌ ditambahkan
    { slot: 1, name: 'Raine', order: 340, send: 240, statusOverride: 'fail' }, // Status ❌ ditambahkan

    // Slot 2
    { slot: 2, name: 'Angel2', order: 600, send: 540, statusOverride: 'fail' },
    { slot: 2, name: 'Autumn', order: 850, send: 375, statusOverride: 'fail' },
    { slot: 2, name: 'Rachel', order: 400, send: 340, statusOverride: 'fail', isSpecial: true },
    { slot: 2, name: 'Honey bear', order: 1400, send: 500, statusOverride: 'fail' }, // Status ❌ ditambahkan
    { slot: 2, name: 'Cem', order: 660, send: 500, statusOverride: 'fail' }, // Status ❌ ditambahkan
    { slot: 2, name: 'Niz', order: 720, send: 540, statusOverride: 'fail' },
    { slot: 2, name: 'Yulii', order: 400, send: 380, statusOverride: 'fail' }, // Status ❌ ditambahkan
    { slot: 2, name: 'Ira', order: 500, send: 320, statusOverride: 'fail' }, // Status ❌ ditambahkan
    { slot: 2, name: 'Rani', order: 420, send: 140, statusOverride: 'fail' }, // Status ❌ ditambahkan
    { slot: 2, name: 'Klara', order: 420, send: 180, statusOverride: 'fail' }, // Status ❌ ditambahkan
    { slot: 2, name: 'Asha', order: 400, send: 180, statusOverride: 'fail' }, // Status ❌ ditambahkan
    { slot: 2, name: 'Eliane', order: 400, send: 180, statusOverride: 'fail' }, // Status ❌ ditambahkan

    // Slot 3
    { slot: 3, name: 'Onde mande', order: 800, send: 240, statusOverride: 'fail' },
    { slot: 3, name: 'Lia', order: 400, send: 380, statusOverride: 'fail' }, // Status ❌ ditambahkan
    { slot: 3, name: 'Rezz', order: 180, send: 160, statusOverride: 'fail' }, // Dipindahkan dari completed, status ❌ ditambahkan
    { slot: 3, name: 'Rendy', order: 1010, send: 180, statusOverride: 'fail' }, // Status ❌ ditambahkan
    { slot: 3, name: 'Saki', order: 120, send: 100, statusOverride: 'fail' },
    { slot: 3, name: 'Ian', order: 1100, send: 120, statusOverride: 'fail' }, // Status ❌ ditambahkan
    { slot: 3, name: 'Lyn', order: 200, send: 40, statusOverride: 'fail' }, // Status ❌ ditambahkan
    { slot: 3, name: 'Fia', order: 800, send: 400, statusOverride: 'fail' }, // Status ❌ ditambahkan

    // Slot 4
    { slot: 4, name: 'Fio2', order: 300, send: 100, statusOverride: 'fail' }, // Status ❌ ditambahkan

    // Riwayat Orderan Selesai
    { slot: 'completed', name: 'Feng', order: 230, send: 230 },
    { slot: 'completed', name: 'Aze', order: 570, send: 570 },
    { slot: 'completed', name: 'Lili', order: 360, send: 360 },
    { slot: 'completed', name: 'Fio', order: 180, send: 180 },
    { slot: 'completed', name: 'Kazuhime', order: 180, send: 180 },
    { slot: 'completed', name: 'Cici', order: 100, send: 100 },
    { slot: 'completed', name: 'Tuna', order: 360, send: 360 },
    { slot: 'completed', name: 'Louis', order: 310, send: 310 },
    { slot: 'completed', name: 'Aya', order: 860, send: 860 },
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
    { slot: 'completed', name: 'Sea', order: 150, send: 157 },
    { slot: 'completed', name: 'Rani', order: 320, send: 320 },
    { slot: 'completed', name: 'Raine', order: 420, send: 420 },
    { slot: 'completed', name: 'Ryu', order: 320, send: 320 },
    { slot: 'completed', name: 'Idnes', order: 320, send: 320 },
    { slot: 'completed', name: 'Rezz', order: 350, send: 350 }
];
        
