import { Component } from '@angular/core';

interface IRanger {
  power: number;
  health: number;
  name: string;
  onGetHit: (power: number) => void;
}

abstract class Player {
  abstract health: number;
  abstract power: number;
  abstract name: string;

  onGetHit(power: number): void {
    const max = power + 3;
    const min = power - 3;
    const hitPower = Math.round(Math.random() * (max - min) + min);
    this.health = Math.max(this.health - hitPower, 0);
    console.log(`${this.name} hit with power ${hitPower}!`);
  }
}

class Ranger extends Player {
  health: number;
  power: number;
  name: string;

  constructor(health: number, power: number, name: string) {
    super();
    this.health = health;
    this.power = power;
    this.name = name;
  }
}
@Component({
  selector: 'app-rangers',
  templateUrl: './rangers.component.html',
  styleUrls: ['./rangers.component.css'],
})
export class RangersComponent {
  ranger1: IRanger | null;
  ranger2: IRanger | null;
  isBattleStarted: boolean;
  isBattleFinished: boolean;
  isRangersCreated: boolean;
  interval: any;

  constructor() {
    this.ranger1 = null;
    this.ranger2 = null;
    this.isBattleFinished = false;
    this.isBattleStarted = false;
    this.isRangersCreated = false;
  }

  createRanger(name: 'ranger1' | 'ranger2') {
    this[name] = new Ranger(100, 15, name);
    console.log(`this[name]`, this[name]);
    if (this.ranger1 && this.ranger2) {
      this.isRangersCreated = true;
    }
  }

  onStartBattle() {
    this.interval = setInterval(this.onBattle.bind(this), 1000);
    this.isBattleStarted = true;
  }

  onShowWinner() {
    if (!this.ranger1 || !this.ranger2) {
      return;
    }
    if (this.ranger1.health > this.ranger2.health) {
      console.log(`The winner is ${this.ranger1.name}!`);
    } else if (this.ranger1.health < this.ranger2.health) {
      console.log(`The winner is ${this.ranger2.name}!`);
    } else {
      console.log(`Battle ended in a draw!`);
    }
  }

  onStopBattle(interval: number = 3000) {
    setTimeout(() => {
      clearInterval(this.interval);
      this.onShowWinner();
      this.isBattleFinished = true;
    }, interval);
  }

  onBattle() {
    if (!this.ranger1 || !this.ranger2) {
      return;
    }
    let rangerToGetHit = this.ranger1;
    let rangerToHit = this.ranger2;

    if (Math.random() > 0.5) {
      [rangerToGetHit, rangerToHit] = [rangerToHit, rangerToGetHit];
    }

    rangerToGetHit.onGetHit(rangerToHit.power);

    if (this.ranger1.health <= 0 || this.ranger2.health <= 0) {
      this.onStopBattle(0);
    }
  }
}
