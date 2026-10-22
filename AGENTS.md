# 🎯 Project Rules: Thai VI & Dividend Portfolio Repository (PTT / Banking / Healthcare)

ไฟล์นี้คือกฎประจำโปรเจกต์ (`Workspace Rule`) ที่ Antigravity (`agy`) จะโหลดเข้าสู่ระบบอัตโนมัติทุกครั้งที่ทำงานในโฟลเดอร์ `C:\Users\26007294\A(i)CODER2025TH\THAI-VI-PORTFOLIO`

---

## 🚨 1. ขั้นตอนบังคับทันทีที่เริ่ม Session ใหม่ (Mandatory Step 0)
1. **อ่านไฟล์ [`HANDOFF.md`](./HANDOFF.md) และ [`README.md`](./README.md) ก่อนเสมอ** เพื่อเข้าใจสถานะพอร์ตปัจจุบัน (`5,000,000 บาท`), ตัวเลขฐานงบการเงินปีล่าสุด (`2568`), ราคาเหมาะสม 4 วิธี (`Fair Value`), และโซนเข้าซื้อ 3 ไม้ของหุ้นทั้ง 5 บริษัท (`PTT`, `BBL`, `KTB`, `BDMS`, `MEGA`)
2. **เปิดอ่านและปฏิบัติตาม Skill บังคับของโปรเจกต์นี้:**
   - **การวิเคราะห์ปัจจัยพื้นฐานและปันผล:** ต้องอ่านและใช้ `C:\Users\26007294\.gemini\config\skills\vi-analysis\SKILL.md` เสมอ (ประเมินมูลค่าครบ 4 วิธี: `DCF`, `P/E Relative`, `Graham Number`, `DDM` และให้คะแนน `VI Scorecard` เต็ม `30 คะแนน`)
   - **การวิเคราะห์กราฟและจุดเข้าซื้อ 3 ไม้:** ต้องอ่านและใช้ `C:\Users\26007294\.gemini\config\skills\technical-timing\SKILL.md` เสมอ (วิเคราะห์ `TF 1M` และ `TF 1W`, ระบุ `Peak-to-Trough Drawdown`, แนวรับ-แนวต้าน, `RSI/Volume`, และแผนแบ่งซื้อ 3 ไม้ `30% / 40% / 30%`)
3. **การออกแบบรายงาน HTML (`reports/*.html`):**
   - ต้องใช้ระบบสีและสไตล์ **Supasit.A Studio Design System** เท่านั้น (`Ink Blue #1D4ED8`, `Amber #8A6410`, พื้นหลัง `#F7F9FC`, การ์ด `#FFFFFF` มุม `13px`, ปุ่มแคปซูล `999px`, ฟอนต์ `Noto Sans Thai`, ห้ามใช้ neumorphism / gradient-text / สีโทน teal)

---

## 🗂️ 2. มาตรฐานโครงสร้างโฟลเดอร์และการตั้งชื่อไฟล์ (Directory & Naming Convention)
ห้ามวางไฟล์ระเกะระกะที่หน้า Root ของโปรเจกต์ ต้องจัดเข้าหมวดหมู่ตามโครงสร้างนี้เสมอ:

1. **`56-1_OneReport/<ปี พ.ศ.>/`** — เก็บไฟล์ต้นฉบับแบบ 56-1 One Report (`.zip` หรือ `.pdf`)
   - รูปแบบชื่อไฟล์: `56-1_<ปี พ.ศ.>_<ชื่อย่อหุ้น>.zip` (เช่น `56-1_2568_PTT.zip`, `56-1_2569_BDMS.zip`)
   - วิธีแกะข้อมูลจาก `.zip`: แตกไฟล์ลงในโฟลเดอร์ชั่วคราว (`scratch`) แล้วใช้ `pdftotext.exe -layout` แปลงไฟล์ PDF เป็น `.txt` เพื่อดึงตัวเลขจริง 100% (ห้ามเดาหรือใช้ตัวเลขจากความจำเด็ดขาด)
2. **`charts/<YYYY-MM>/`** — เก็บภาพกราฟเทคนิคแยกตามปี-เดือนที่บันทึกภาพ
   - รูปแบบชื่อไฟล์: `<ชื่อย่อหุ้น>_TF1M.png` และ `<ชื่อย่อหุ้น>_TF1W.png` (เช่น `BDMS_TF1M.png`, `BDMS_TF1W.png`)
3. **`reports/`** — เก็บรายงานฉบับสมบูรณ์ทั้งแบบ `.html` และ `.md`
   - `00_Master_Portfolio_5M_Blueprint.html` และ `.md` (หน้า Dashboard จำลองพอร์ตหลัก)
   - `01_Energy_<หุ้น>_VI_Report.html` และ `01_Energy_<หุ้น>_VI_Analysis.md`
   - `02_Bank_<หุ้น>_VI_Report.html` และ `02_Bank_<หุ้น>_VI_Analysis.md`
   - `03_Health_<หุ้น>_VI_Report.html` และ `03_Health_<หุ้น>_VI_Analysis.md`
   - *(หากเพิ่มอุตสาหกรรมที่ 4 ให้ตั้งชื่อเรียงลำดับเป็น `04_<Sector>_...`)*

---

## 🔄 3. กฎการอัปเดตและส่งต่องาน (Update & Handoff Protocol)
- ทุกครั้งที่มีการอัปเดตงบปีใหม่ (`56-1`), อัปเดตกราฟราคาใหม่, หรือเพิ่มหุ้นตัวใหม่:
  1. ต้องเสนอสรุปผลการวิเคราะห์และขอคำว่า **"อนุมัติ"** จากพี่ A ก่อนสร้างหรือแก้ไขไฟล์รายงานเสมอ
  2. เมื่อพี่ A อนุมัติแล้ว ต้องอัปเดตทั้งไฟล์ใน `reports/`, หน้าสารบัญ [`README.md`](./README.md), และสมุดส่งต่องาน [`HANDOFF.md`](./HANDOFF.md) ให้ข้อมูลตรงกันทุกจุด
  3. ตรวจสอบลิงก์รูปภาพ (`../charts/...`) และปุ่มลิงก์เชื่อมหน้าใน `.html` ทุกไฟล์ไม่ให้พัง ก่อนสั่ง `git commit` และ `git push origin main` ขึ้น `https://github.com/supasiao7896TH/THAI-VI-PORTFOLIO`
