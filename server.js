import chalk from "chalk";
import figlet from "figlet";
import readlineSync from "readline-sync";
import { startGame } from "./game.js";
import { initializeAchievements, displayAchievements } from "./achievements.js";

// 로비 화면을 출력하는 함수
function displayLobby() {
  console.clear();

  // 타이틀 텍스트
  console.log(
    chalk.cyan(
      figlet.textSync("RogueLike", {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    )
  );

  // 상단 경계선
  const line = chalk.magentaBright("=".repeat(50));
  console.log(line);

  // 게임 이름
  console.log(chalk.yellowBright.bold("CLI 게임에 오신것을 환영합니다!"));

  // 설명 텍스트
  console.log(chalk.green("옵션을 선택해주세요."));
  console.log();

  // 옵션들
  console.log(chalk.blue("1.") + chalk.white(" 새로운 게임 시작"));
  console.log(chalk.blue("2.") + chalk.white(" 업적 확인하기"));
  console.log(chalk.blue("3.") + chalk.white(" 옵션"));
  console.log(chalk.blue("4.") + chalk.white(" 종료"));

  // 하단 경계선
  console.log(line);

  // 하단 설명
  console.log(chalk.gray("1-4 사이의 수를 입력한 뒤 엔터를 누르세요."));
}

// 유저 입력을 받아 처리하는 함수
function handleUserInput() {
  const choice = readlineSync.question("입력:");

  switch (choice) {
    case "1":
      console.log(chalk.green("게임을 시작합니다."));
      // 업적 초기화
      initializeAchievements();
      // 새로운 게임 시작
      startGame();
      break;
    case "2":
      console.log(chalk.yellow("업적 목록을 확인합니다."));
      // 업적 확인 로직
      displayAchievements();
      handleUserInput(); // 다시 메뉴로 돌아가기
      break;
    case "3":
      /*
       * 옵션 메뉴에 따른 옵션 메뉴 설명
       */
      console.log(chalk.blue("1번을 누르면 스테이지를 실행합니다"));
      console.log(
        chalk.blue("2번을 누르면 오늘 했던 게임에 대한 업적을 보여줍니다.")
      );
      console.log(chalk.blue("3번은 모든 메뉴에 대한 설명을 출력합니다."));
      console.log(
        chalk.blue("4번을 선택 시 게임이 종료되며 업적이 초기화 됩니다.")
      );
      // 옵션 메뉴 로직을 구현
      handleUserInput();
      break;
    case "4":
      console.log(chalk.red("게임을 종료합니다."));
      // 게임 종료 로직
      process.exit(0); // 게임 종료
      break;
    default:
      console.log(chalk.red("올바른 선택을 하세요."));
      handleUserInput(); // 유효하지 않은 입력일 경우 다시 입력 받음
  }
}

// 게임 시작 함수
function start() {
  displayLobby();
  handleUserInput();
}

// 게임 실행
start();
