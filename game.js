import chalk from "chalk";
import readlineSync from "readline-sync";
import {
  initializeAchievements,
  addDamage,
  displayAchievements,
} from "./achievements.js";

class Player {
  constructor() {
    this.hp = 100;
    this.attackPower = 10; // 공격력
    this.skillPower = 20;
  }

  attack(monster) {
    const damage = Math.floor(Math.random() * this.attackPower) + 1;
    monster.hp -= damage;
    addDamage(damage); // 데미지를 입히면 업적을 추가
    return damage;
  }

  skill(monster) {
    const skillDamage = Math.floor(Math.random() * this.skillPower) + 1;
    monster.hp -= skillDamage;
    addDamage(skillDamage); // 스킬 데미지를 입히면 업적을 추가
    return skillDamage;
  }
}

class Monster {
  constructor(stage) {
    this.hp = stage * 20;
    this.attackPower = 5 + stage; // 스테이지가 높아질수록 강해짐
  }

  attack(player) {
    const damage = Math.floor(Math.random() * this.attackPower) + 1;
    player.hp -= damage;
    return damage;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
      chalk.blueBright(`| 플레이어 HP: ${player.hp}`) +
      chalk.redBright(`| 몬스터 HP: ${monster.hp} |`)
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while (player.hp > 0 && monster.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));
    console.log(chalk.green(`\n1. 공격한다 2. 아무것도 하지않는다.`));
    const choice = readlineSync.question("선택?");

    if (choice === "1") {
      // 플레이어 공격
      const skillChoice = readlineSync.question(
        "스킬을 사용하시겠습니까? (Y/N)"
      );

      // 플레이어 스킬 사용
      if (skillChoice.toUpperCase() === "Y") {
        const playerSkillDamage = player.skill(monster);

        logs.push(
          chalk.green(
            `플레이어가 몬스터에게 스킬로 ${playerSkillDamage}의 데미지를 입혔습니다!`
          )
        );

        // 몬스터의 체력이 남아 있을 경우 반격
        if (monster.hp > 0) {
          const monsterDamage = monster.attack(player);
          logs.push(
            chalk.red(
              `몬스터가 플레이어에게 ${monsterDamage}의 데미지를 입혔습니다!`
            )
          );
        }
      } else if (skillChoice.toUpperCase() === "N") {
        // 평타
        const playerDamage = player.attack(monster);
        logs.push(
          chalk.green(
            `플레이어가 몬스터에게 ${playerDamage}의 데미지를 입혔습니다!`
          )
        );

        // 몬스터의 체력이 남아 있을 경우 반격
        if (monster.hp > 0) {
          const monsterDamage = monster.attack(player);
          logs.push(
            chalk.red(
              `몬스터가 플레이어에게 ${monsterDamage}의 데미지를 입혔습니다!`
            )
          );
        }
      }
    } else {
      logs.push(chalk.yellow("플레이어가 아무것도 하지 않았습니다."));
      const monsterDamage = monster.attack(player);
      logs.push(
        chalk.red(
          `몬스터가 플레이어에게 ${monsterDamage}의 데미지를 입혔습니다!`
        )
      );
    }

    if (player.hp <= 0) {
      console.log(chalk.red("플레이어가 쓰러졌습니다. 게임 종료."));
      break;
    } else if (monster.hp <= 0) {
      console.log(chalk.blue("몬스터를 물리쳤습니다!"));
      break;
    }
  }
};

export async function startGame() {
  console.clear();
  initializeAchievements(); // 업적 초기화

  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);

    // 스테이지 클리어 조건: 플레이어가 살아있고 몬스터를 물리쳤을 때
    if (player.hp > 0) {
      console.log(chalk.blueBright(`\n축하합니다! 스테이지 ${stage} 클리어!`));
      player.hp += 20; // 스테이지 클리어 시 HP 회복
      stage++;
    } else {
      console.log(chalk.red("게임 오버. 다시 도전하세요!"));
      break;
    }
  }

  if (player.hp > 0 && stage > 10) {
    console.log(chalk.green("모든 스테이지를 클리어했습니다! 축하합니다!"));
  }

  // 게임 종료 후 업적 확인
  displayAchievements();
}
