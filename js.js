document.addEventListener("DOMContentLoaded", function () {
  const combinedForm = document.getElementById("combinedForm");
  const loveStory = document.getElementById("loveStory");
  const charRemaining = document.getElementById("charRemaining");

  // Character counter for love story
  if (loveStory && charRemaining) {
    loveStory.addEventListener("input", function () {
      const remaining = 500 - this.value.length;
      charRemaining.textContent = remaining;
      charRemaining.style.color = remaining < 50 ? "#ff5252" : "#888";
    });
  }

  // Allow Enter key to create new line in all text inputs and textareas
  const textInputs = document.querySelectorAll('input[type="text"], textarea');
  textInputs.forEach((input) => {
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        // For single-line inputs, prevent default and blur the field
        if (this.tagName === "INPUT") {
          e.preventDefault();
          this.blur();
        }
        // For textareas, allow new lines
        else if (this.tagName === "TEXTAREA") {
          e.preventDefault();
          const start = this.selectionStart;
          const end = this.selectionEnd;

          // Insert newline
          this.value =
            this.value.substring(0, start) + "\n" + this.value.substring(end);

          // Move cursor to after the newline
          this.selectionStart = this.selectionEnd = start + 1;
        }
      }
    });
  });

  // Prevent form submission on Enter key press except for textareas
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
    }
  });

  // Form submission handler
  if (combinedForm) {
    combinedForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validate required fields
      const kodeUndangan = document.getElementById("kodeUndangan");
      if (!kodeUndangan.value.trim()) {
        alert("Kode Undangan wajib diisi!");
        kodeUndangan.focus();
        return;
      }

      // Helper function to get field values
      const getValue = (id) => {
        const el = document.getElementById(id);
        return el ? el.value.trim() : "";
      };

      // Prepare complete form data
      const formData = {
        pengantin: {
          pria: {
            nama: getValue("groomName"),
            ayah: getValue("groomFather"),
            ibu: getValue("groomMother"),
          },
          wanita: {
            nama: getValue("brideName"),
            ayah: getValue("brideFather"),
            ibu: getValue("brideMother"),
          },
        },
        kisahCinta: getValue("loveStory"),
        akad: {
          tanggal: getValue("akadDate"),
          waktu: getValue("akadTime"),
          lokasi: getValue("akadLocation"),
        },
        resepsi: {
          jenis: getValue("resepsiType"),
          tanggal: getValue("resepsiDate"),
          waktu: getValue("resepsiTime"),
          lokasi: getValue("resepsiLocation"),
        },
        rekening: {
          bank1: {
            nama: getValue("bankName1"),
            nomor: getValue("accountNumber1"),
            atasNama: getValue("accountHolder1"),
          },
          bank2: {
            nama: getValue("bankName2"),
            nomor: getValue("accountNumber2"),
            atasNama: getValue("accountHolder2"),
          },
        },
        undangan: {
          kode: getValue("kodeUndangan"),
          tema: getValue("temaUndangan"),
          requestLagu: getValue("requestLagu"),
        },
        metadata: {
          waktuSubmit: new Date().toISOString(),
        },
      };

      // Save to localStorage
      const existingData = JSON.parse(
        localStorage.getItem("weddingFormData") || "[]"
      );
      existingData.push(formData);
      localStorage.setItem("weddingFormData", JSON.stringify(existingData));

      // Prepare success message
      let successMessage = "✅ Semua data berhasil disimpan!\n\n";
      if (formData.pengantin.pria.nama || formData.pengantin.wanita.nama) {
        successMessage += `Pasangan: ${formData.pengantin.pria.nama || "-"} & ${
          formData.pengantin.wanita.nama || "-"
        }\n`;
      }
      if (formData.akad.tanggal) {
        successMessage += `Tanggal Akad: ${formData.akad.tanggal}\n`;
      }
      if (formData.undangan.kode) {
        successMessage += `\nKode Undangan: ${formData.undangan.kode}\n`;
      }
      if (formData.undangan.requestLagu) {
        successMessage += `\nRequest Lagu:\n${formData.undangan.requestLagu}\n`;
      }

      alert(successMessage);
      console.log("Data lengkap tersimpan:", formData);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

// Tambahkan di akhir file
document.getElementById("sendEmailBtn").addEventListener("click", function () {
  const formData = getFormData();
  const subject = `Data Pernikahan ${formData.pengantin.pria.nama} & ${formData.pengantin.wanita.nama}`;
  const body = formatDataForEmail(formData);

  window.location.href = `mailto:dimasmayoni8829@gmail.com?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
});

document
  .getElementById("sendWhatsAppBtn")
  .addEventListener("click", function () {
    const formData = getFormData();
    const message = formatDataForWhatsApp(formData);
    const phoneNumber = "6289688290484"; // Ganti dengan nomor WhatsApp tujuan

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  });

function getFormData() {
  // Gunakan fungsi yang sudah ada untuk mengumpulkan data
  const getValue = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  };

  return {
    pengantin: {
      pria: {
        nama: getValue("groomName"),
        ayah: getValue("groomFather"),
        ibu: getValue("groomMother"),
      },
      wanita: {
        nama: getValue("brideName"),
        ayah: getValue("brideFather"),
        ibu: getValue("brideMother"),
      },
    },
    kisahCinta: getValue("loveStory"),
    akad: {
      tanggal: getValue("akadDate"),
      waktu: getValue("akadTime"),
      lokasi: getValue("akadLocation"),
    },
    resepsi: {
      jenis: getValue("resepsiType"),
      tanggal: getValue("resepsiDate"),
      waktu: getValue("resepsiTime"),
      lokasi: getValue("resepsiLocation"),
    },
    rekening: {
      bank1: {
        nama: getValue("bankName1"),
        nomor: getValue("accountNumber1"),
        atasNama: getValue("accountHolder1"),
      },
      bank2: {
        nama: getValue("bankName2"),
        nomor: getValue("accountNumber2"),
        atasNama: getValue("accountHolder2"),
      },
    },
    undangan: {
      kode: getValue("kodeUndangan"),
      tema: getValue("temaUndangan"),
      requestLagu: getValue("requestLagu"),
    },
  };
}

function formatDataForEmail(formData) {
  return `Data Pernikahan:
  
Pasangan:
${formData.pengantin.pria.nama} (Putra dari ${formData.pengantin.pria.ayah} & ${formData.pengantin.pria.ibu})
${formData.pengantin.wanita.nama} (Putri dari ${formData.pengantin.wanita.ayah} & ${formData.pengantin.wanita.ibu})

Kisah Cinta:
${formData.kisahCinta}

Detail Akad:
Tanggal: ${formData.akad.tanggal}
Waktu: ${formData.akad.waktu}
Lokasi: ${formData.akad.lokasi}

Detail Resepsi:
Jenis: ${formData.resepsi.jenis}
Tanggal: ${formData.resepsi.tanggal}
Waktu: ${formData.resepsi.waktu}
Lokasi: ${formData.resepsi.lokasi}

Informasi Rekening:
Bank 1: ${formData.rekening.bank1.nama} - ${formData.rekening.bank1.nomor} (${formData.rekening.bank1.atasNama})
Bank 2: ${formData.rekening.bank2.nama} - ${formData.rekening.bank2.nomor} (${formData.rekening.bank2.atasNama})

Informasi Undangan:
Kode: ${formData.undangan.kode}
Tema: ${formData.undangan.tema}
Request Lagu: ${formData.undangan.requestLagu}`;
}

function formatDataForWhatsApp(formData) {
  return `*DATA PERNIKAHAN*

*Pasangan:*
👨 ${formData.pengantin.pria.nama} (Putra dari ${
    formData.pengantin.pria.ayah
  } & ${formData.pengantin.pria.ibu})
👩 ${formData.pengantin.wanita.nama} (Putri dari ${
    formData.pengantin.wanita.ayah
  } & ${formData.pengantin.wanita.ibu})

*Akad Nikah:*
📅 ${formData.akad.tanggal}
⏰ ${formData.akad.waktu}
📍 ${formData.akad.lokasi}

*Resepsi:*
🎉 ${formData.resepsi.jenis}
📅 ${formData.resepsi.tanggal}
⏰ ${formData.resepsi.waktu}
📍 ${formData.resepsi.lokasi}

*Rekening:*
💳 ${formData.rekening.bank1.nama} - ${formData.rekening.bank1.nomor} (${
    formData.rekening.bank1.atasNama
  }
${
  formData.rekening.bank2.nama
    ? "💳 " +
      formData.rekening.bank2.nama +
      " - " +
      formData.rekening.bank2.nomor +
      " (" +
      formData.rekening.bank2.atasNama +
      ")"
    : ""
}

*Kode Undangan:* ${formData.undangan.kode}
*Tema:* ${formData.undangan.tema}`;
}
