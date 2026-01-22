import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const xlsx = require('xlsx');
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const EXCEL_PATH = path.join(rootDir, 'data', 'invite.xlsx');
const PUBLIC_DIR = path.join(rootDir, 'public');
const OUTPUT_PATH = path.resolve(PUBLIC_DIR, 'invite.json');

try {
  if (!fs.existsSync(EXCEL_PATH)) throw new Error(`엑셀 파일 없음: ${EXCEL_PATH}`);
  const workbook = xlsx.readFile(EXCEL_PATH);

  const parseKeyValue = (sheetName) => {
    // 엑셀 시트명 '5P 갤러리/PDF'를 정확히 찾기 위해 여러 시나리오를 대비합니다
    const sheet = workbook.Sheets[sheetName] || 
                  workbook.Sheets['5P 갤러리/PDF'] || 
                  workbook.Sheets['5P 갤러리／PDF']; // 전각 기호 대비
    if (!sheet) return {};
    const data = xlsx.utils.sheet_to_json(sheet, { header: 'A' });
    const result = {};
    data.slice(1).forEach(row => {
      const key = row['B']?.toString().trim();
      const value = row['C']?.toString().trim();
      if (key) result[key] = value ?? "";
    });
    return result;
  };

  const parseAgenda = () => {
    const sheet = workbook.Sheets['AGENDA'];
    if (!sheet) return [];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 'A', defval: "" });
    const agenda = [];
    let currentDay = null;
    data.forEach(row => {
      const cellB = row['B']?.toString().trim();
      if (cellB && cellB.includes('Day')) {
        currentDay = { day_label: cellB, items: [] };
        agenda.push(currentDay);
      } else if (currentDay && cellB && cellB !== "시간" && !cellB.includes('Day')) {
        currentDay.items.push({
          time: cellB,
          title: row['C'] || "",
          speaker: row['H'] || row['G'] || ""
        });
      }
    });
    return agenda;
  };

  const metaRaw = parseKeyValue('META');
  const invRaw = parseKeyValue('INVITATION');
  const locRaw = parseKeyValue('LOCATION');
  const galRaw = parseKeyValue('5P 갤러리/PDF'); // 시트명 매칭

  const finalData = {
    meta: {
      title: metaRaw['행사명'] || "",
      datetime: metaRaw['날짜 및 시간'] || "",
      venue: metaRaw['장소'] || ""
    },
    invitation: { message: invRaw['초대의 글 (여러 줄 허용)'] || "" },
    agenda: parseAgenda(),
    location: {
      address: locRaw['주소'] || "",
      naver_map_url: locRaw['네이버 지도 URL'] || "",
      contact_name: locRaw['문의 담당자'] || "",
      contact_phone: locRaw['문의 전화'] || "",
      contact_email: locRaw['문의 이메일'] || ""
    },
    gallery: {
      // 엑셀의 'image' 필드(info.png)를 가져옵니다
      image_file: galRaw['image'] || "",
      // 엑셀의 '브로셔 파일명' 필드(brochure.pdf)를 가져옵니다
      brochure_file: galRaw['브로셔 파일명'] || ""
    }
  };

  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(finalData, null, 2));
  console.log('✅ invite.json 생성 완료!');
} catch (err) {
  console.error('❌ 에러:', err.message);
  process.exit(1);
}