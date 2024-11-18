import fs from "fs"; // 파일 시스템 모듈
import chalk from "chalk"; // 텍스트 색상 설정을 위한 모듈

// 업적 파일 경로
const ACHIEVEMENTS_FILE = "./achievements.json";

// 업적 파일 초기화 (없으면 생성)
export function initializeAchievements() {
  if (!fs.existsSync(ACHIEVEMENTS_FILE)) {
    const initialData = {
      achievements: [
        {
          id: 1,
          name: "초보 모험가",
          description: "누적 100 데미지를 입혔습니다.",
          damageRequired: 100,
          unlocked: false,
        },
        {
          id: 2,
          name: "숙련자",
          description: "누적 500 데미지를 입혔습니다.",
          damageRequired: 500,
          unlocked: false,
        },
        {
          id: 3,
          name: "전설의 용사",
          description: "누적 1000 데미지를 입혔습니다.",
          damageRequired: 1000,
          unlocked: false,
        },
      ],
      totalDamage: 0, // 누적 데미지 추적
    };
    fs.writeFileSync(ACHIEVEMENTS_FILE, JSON.stringify(initialData, null, 2));
  }
}

// 업적 데이터 불러오기
export function getAchievements() {
  const data = fs.readFileSync(ACHIEVEMENTS_FILE, "utf-8");
  return JSON.parse(data);
}

// 업적 데이터 저장
export function saveAchievements(data) {
  fs.writeFileSync(ACHIEVEMENTS_FILE, JSON.stringify(data, null, 2));
}

// 업적 목록 출력
export function displayAchievements() {
  const data = getAchievements();
  console.clear();
  console.log(chalk.magentaBright("=== 업적 목록 ==="));
  data.achievements.forEach((achievement) => {
    console.log(
      chalk.green(achievement.name) +
        ` - ${achievement.description} ` +
        (achievement.unlocked ? chalk.yellow("[달성]") : chalk.red("[미달성]"))
    );
  });
  console.log(chalk.cyan(`현재 누적 데미지: ${data.totalDamage}`));
}

// 데미지 누적 및 업적 달성 처리
export function addDamage(damage) {
  const data = getAchievements();

  // 데미지 누적
  data.totalDamage += damage;
  console.log(chalk.blue(`몬스터에게 ${damage} 데미지를 입혔습니다!`));
  console.log(chalk.cyan(`현재 누적 데미지: ${data.totalDamage}`));

  // 업적 달성 확인
  data.achievements.forEach((achievement) => {
    if (
      !achievement.unlocked &&
      data.totalDamage >= achievement.damageRequired
    ) {
      achievement.unlocked = true;
      console.log(chalk.green(`"${achievement.name}" 업적을 달성했습니다!`));
    }
  });

  saveAchievements(data);
}

// 업적 초기화 (모든 업적 잠금 상태로 되돌리기)
export function resetAchievements() {
  const data = getAchievements();
  data.achievements.forEach((achievement) => (achievement.unlocked = false));
  data.totalDamage = 0;
  saveAchievements(data);
  console.log(chalk.cyan("모든 업적과 누적 데미지가 초기화되었습니다."));
}
