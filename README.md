# 📈 Thai Value Investing (VI) & Dividend Portfolio Repository
**จัดทำสำหรับ:** พี่ A (`A-Class WebCraft | Code • Share • Inspire | by Supasit.A`)  
**โบรกเกอร์หลัก:** Bualuang Securities (หลักทรัพย์บัวหลวง)  
**อัปเดตล่าสุด:** 22 ตุลาคม 2569 (2026-10-22)

คลังข้อมูลรายงานการวิเคราะห์หุ้นปันผลระยะยาว (**Core Dividend & Defensive Growth Portfolio**) อ้างอิงข้อมูลจริงจากรายงานประจำปี **56-1 One Report ปี 2568 (2025 Actuals)** ครบทั้งงบการเงิน การประเมินมูลค่าที่แท้จริง 4 วิธี (`DCF`, `P/E Relative`, `Graham Number`, `DDM`), ตารางคะแนน `VI Scorecard (/30)`, แผนการเข้าซื้อ 3 ไม้ (`Entry Timing`) จากกราฟเทคนิคจริง `Timeframe 1M` และ `1W`, และแผนจัดสรรพอร์ตเงินสด **`5,000,000 บาท`**

---

## 🌐 คลิกเปิดใช้งานเว็บแอป PWA ออนไลน์ (Cloudflare Workers Live + PWA)

> **🚀 ลิงก์หลักบน Cloudflare Workers (ดึงราคาหุ้นตลาดหลักทรัพย์ SET สดตลอดเวลา + ติดตั้งเป็นแอป PWA ลงมือถือ/คอมได้):**
> - 🏠 **หน้าหลักแอป PWA:** **[https://thai-vi-portfolio.supasiao.workers.dev](https://thai-vi-portfolio.supasiao.workers.dev)**
> - 🏛️ **[00. หน้า Dashboard จำลองพอร์ต 5,000,000 บาท (Live Simulator)](https://thai-vi-portfolio.supasiao.workers.dev/reports/00_Master_Portfolio_5M_Blueprint.html)**
> - ⚡ **[01. รายงานกลุ่มพลังงาน: หุ้น PTT (Live Price)](https://thai-vi-portfolio.supasiao.workers.dev/reports/01_Energy_PTT_VI_Report.html)**
> - 🏦 **[02. รายงานกลุ่มธนาคาร: BBL vs KTB (Live Price)](https://thai-vi-portfolio.supasiao.workers.dev/reports/02_Bank_BBL_vs_KTB_VI_Report.html)**
> - 🏥 **[03. รายงานกลุ่มสุขภาพรับสังคมสูงวัย: BDMS vs MEGA (Live Price)](https://thai-vi-portfolio.supasiao.workers.dev/reports/03_Health_BDMS_vs_MEGA_VI_Report.html)**
> - 📡 **API ราคาหุ้นสด (JSON):** [`https://thai-vi-portfolio.supasiao.workers.dev/api/quotes`](https://thai-vi-portfolio.supasiao.workers.dev/api/quotes)

---

## 🏆 ตารางสรุปพอร์ตหุ้นปันผล 3 อุตสาหกรรมหลัก (Master VI Scorecard & Action Plan)

| อุตสาหกรรม / หุ้น | สัดส่วนพอร์ต | ราคาตลาดล่าสุด (SET Live) | EPS / BVPS (ปี 2568) | P/E / P/BV | ปันผลปี 2568 (`DPS`) | Gross Yield | Fair Value อ้างอิง | Margin of Safety | คะแนน VI (`/30`) | สถานะและโซนราคาเข้าสะสม (Action Plan) |
|---|---:|---:|---|---:|---:|---:|---:|---:|---:|---|
| ⚡ **1. พลังงาน: `PTT`** | **`30%`** | **`41.50 บ.`** | `3.15` / `39.96` | `13.17x` / `1.04x` | **`2.30 บ.`** *(ปกติ 2.10)* | **`5.54%`** | **`41.48 บ.`** | **`-0.05%`** | **`24 / 30`** | 🔴 **รอย่อตัว (`37.00–38.00` / `33.50–35.00` / `30.50–32.50`)** |
| 🏦 **2. ธนาคาร: `BBL`** | **`25%`** | **`183.50 บ.`** | `24.10` / `300.67` | `7.61x` / **`0.61x`** | **`10.00 บ.`** | **`5.45%`** | **`237.59 บ.`** | **`+22.8%`** | **🏆 `26 / 30`** | 🟡 **รอรับไม้ 1 (`172.0–180.5` / `158.0–165.0` / `138.0–148.0`)** |
| 🏦 **3. ธนาคาร: `KTB`** | **`10%`** | **`43.25 บ.`** | `3.45` / `33.20` | `12.54x` / `1.30x` | **`2.67 บ.`** *(ปกติ 2.07)* | **`6.17%`** | **`35.72 บ.`** | **`-21.1%`** | **`24 / 30`** | 🔴 **รอย่อตัว (`33.00–35.50` / `28.50–31.00` / `25.00–27.50`)** |
| 🏥 **4. สุขภาพ: `BDMS`** | **`25%`** | **`19.40 บ.`** | `1.00` / `6.66` | `19.40x` / `2.91x` | **`1.00 บ.`** *(ปกติ 0.75)* | **`5.15%`** | **`24.13 บ.`** | **`+19.6%`** | **🏆 `28 / 30`** | 🟢 **เข้าโซนไม้ 1 (`19.00–19.50` / `17.50–18.75` / `ทะลุ 20.60`)** |
| 💊 **5. สุขภาพ: `MEGA`** | **`10%`** | **`34.50 บ.`** | `2.19` / `11.72` | `15.75x` / `2.94x` | **`1.60 บ.`** | **`4.64%`** | **`34.20 บ.`** | **`-0.88%`** | **`26 / 30`** | 🔴 **รอย่อตัว (`29.50–31.50` / `26.50–28.50` / `24.00–26.00`)** |

---

## 🗂️ โครงสร้างหมวดหมู่ไฟล์ใน Repository (Directory Structure)

```text
THAI-VI-PORTFOLIO/
├── AGENTS.md                                       # กฎประจำโปรเจกต์ (agy โหลดเข้าสมองอัตโนมัติทุกครั้ง)
├── HANDOFF.md                                      # สมุดส่งเวรบันทึกสถานะพอร์ต & SOP สำหรับอัปเดตงานข้ามปี
├── README.md                                       # หน้าสารบัญหลัก Master VI Portfolio
├── index.html                                      # หน้าแรกสำหรับเปิดดูรายงานผ่านเว็บ (GitHub Pages)
├── 56-1_OneReport/                                 # 📂 1. หมวดเอกสาร 56-1 One Report แยกตามปี พ.ศ.
│   └── 2568/
│       ├── 56-1_2568_PTT.zip
│       ├── 56-1_2568_BBL.zip
│       ├── 56-1_2568_KTB.zip
│       ├── 56-1_2568_BDMS.zip
│       └── 56-1_2568_MEGA.zip
├── charts/                                         # 📂 2. หมวดกราฟเทคนิค แยกตามรอบเดือนที่วิเคราะห์
│   └── 2026-10/
│       ├── PTT_TF1M.png  & PTT_TF1W.png
│       ├── BBL_TF1M.png  & BBL_TF1W.png
│       ├── KTB_TF1M.png  & KTB_TF1W.png
│       ├── BDMS_TF1M.png & BDMS_TF1W.png
│       └── MEGA_TF1M.png & MEGA_TF1W.png
└── reports/                                        # 📂 3. หมวดรายงานวิเคราะห์ VI (.html และ .md)
    ├── 00_Master_Portfolio_5M_Blueprint.html
    ├── 00_Master_Portfolio_5M_Blueprint.md
    ├── 01_Energy_PTT_VI_Report.html
    ├── 01_Energy_PTT_VI_Analysis.md
    ├── 02_Bank_BBL_vs_KTB_VI_Report.html
    ├── 02_Bank_BBL_vs_KTB_VI_Analysis.md
    ├── 03_Health_BDMS_vs_MEGA_VI_Report.html
    └── 03_Health_BDMS_vs_MEGA_VI_Analysis.md
```

---

## 📂 สารบัญลิงก์ตรงไปยังไฟล์รายงานและเอกสารอ้างอิง

### 🏛️ 0. แผนจัดพอร์ตหุ้นปันผลระยะยาว 5,000,000 บาท (Master Portfolio Allocation & Simulator)
- 🌐 **Interactive Portfolio Dashboard (HTML):** [`reports/00_Master_Portfolio_5M_Blueprint.html`](./reports/00_Master_Portfolio_5M_Blueprint.html)
- 📄 **รายงาน Markdown:** [`reports/00_Master_Portfolio_5M_Blueprint.md`](./reports/00_Master_Portfolio_5M_Blueprint.md)

### ⚡ 1. กลุ่มพลังงาน (Energy Sector — `PTT`)
- 🌐 **Interactive Web Report (HTML):** [`reports/01_Energy_PTT_VI_Report.html`](./reports/01_Energy_PTT_VI_Report.html)
- 📄 **รายงาน Markdown:** [`reports/01_Energy_PTT_VI_Analysis.md`](./reports/01_Energy_PTT_VI_Analysis.md)
- 📦 **เอกสาร 56-1 ปี 2568:** [`56-1_OneReport/2568/56-1_2568_PTT.zip`](./56-1_OneReport/2568/56-1_2568_PTT.zip)
- 📊 **กราฟเทคนิค:** [`PTT_TF1M.png`](./charts/2026-10/PTT_TF1M.png) · [`PTT_TF1W.png`](./charts/2026-10/PTT_TF1W.png)

### 🏦 2. กลุ่มธนาคารพาณิชย์ (Banking Sector — `BBL` vs `KTB`)
- 🌐 **Interactive Web Report (HTML):** [`reports/02_Bank_BBL_vs_KTB_VI_Report.html`](./reports/02_Bank_BBL_vs_KTB_VI_Report.html)
- 📄 **รายงาน Markdown:** [`reports/02_Bank_BBL_vs_KTB_VI_Analysis.md`](./reports/02_Bank_BBL_vs_KTB_VI_Analysis.md)
- 📦 **เอกสาร 56-1 ปี 2568:** [`56-1_2568_BBL.zip`](./56-1_OneReport/2568/56-1_2568_BBL.zip) · [`56-1_2568_KTB.zip`](./56-1_OneReport/2568/56-1_2568_KTB.zip)
- 📊 **กราฟเทคนิค:** [`BBL_TF1M.png`](./charts/2026-10/BBL_TF1M.png) · [`BBL_TF1W.png`](./charts/2026-10/BBL_TF1W.png) · [`KTB_TF1M.png`](./charts/2026-10/KTB_TF1M.png) · [`KTB_TF1W.png`](./charts/2026-10/KTB_TF1W.png)

### 🏥 3. กลุ่มสุขภาพและเวชภัณฑ์รับสังคมสูงวัย (Healthcare & Aging Society — `BDMS` vs `MEGA`)
- 🌐 **Interactive Web Report (HTML):** [`reports/03_Health_BDMS_vs_MEGA_VI_Report.html`](./reports/03_Health_BDMS_vs_MEGA_VI_Report.html)
- 📄 **รายงาน Markdown:** [`reports/03_Health_BDMS_vs_MEGA_VI_Analysis.md`](./reports/03_Health_BDMS_vs_MEGA_VI_Analysis.md)
- 📦 **เอกสาร 56-1 ปี 2568:** [`56-1_2568_BDMS.zip`](./56-1_OneReport/2568/56-1_2568_BDMS.zip) · [`56-1_2568_MEGA.zip`](./56-1_OneReport/2568/56-1_2568_MEGA.zip)
- 📊 **กราฟเทคนิค:** [`BDMS_TF1M.png`](./charts/2026-10/BDMS_TF1M.png) · [`BDMS_TF1W.png`](./charts/2026-10/BDMS_TF1W.png) · [`MEGA_TF1M.png`](./charts/2026-10/MEGA_TF1M.png) · [`MEGA_TF1W.png`](./charts/2026-10/MEGA_TF1W.png)

---

## 🔄 คู่มือการอัปเดตข้อมูลในปีถัดไป (Annual 56-1 Update Guide)
เมื่อบริษัทประกาศแบบ `56-1 One Report` ประจำปีใหม่ (ช่วงเดือนมีนาคม–เมษายน ของทุกปี):
1. นำไฟล์ `.zip` หรือ `.pdf` ของ 56-1 ปีใหม่มาวางในโฟลเดอร์ `56-1_OneReport/2569/` (หรือวางไว้ที่หน้าแรกแล้วสั่งให้ AI จัดหมวดหมู่ให้)
2. นำภาพกราฟ `TF 1M` และ `TF 1W` ล่าสุดมาวางเพื่ออัปเดต `Entry Timing`
3. สั่ง AI ใน CLI ว่า **"ช่วยอัปเดตวิเคราะห์ 56-1 ปีล่าสุดเทียบกับปี 2568"** เพื่ออัปเดต Fair Value 4 วิธี, ตารางคะแนน VI Scorecard และแผนจัดพอร์ตโดยไม่สูญเสียข้อมูลประวัติศาสตร์ของปีก่อนหน้า
