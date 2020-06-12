import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs/internal/observable/of';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroComponent } from '../hero/hero.component';
import { HeroesComponent } from './heroes.component';
import { NO_ERRORS_SCHEMA, Directive, Input } from '@angular/core';

@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

describe('HeroesComponent', () => {

  let HEROES: Hero[];
  let mockHeroService;
  let fixture: ComponentFixture<HeroesComponent>;

  beforeEach(() => {
    HEROES = [
      { id: 1, name: 'Ajith', strength: 80 },
      { id: 2, name: 'Vijay', strength: 70 },
      { id: 3, name: 'Rajini', strength: 60 }
    ];
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

    TestBed.configureTestingModule({
      declarations: [
        HeroesComponent,
        HeroComponent,
        RouterLinkDirectiveStub
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService }
      ],
      // schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(HeroesComponent);
  });

  describe('ngOnInit', () => {
    it('should call getHeroes from the service once', () => {
      mockHeroService.getHeroes.and.returnValue(of(HEROES));

      fixture.detectChanges();

      expect(mockHeroService.getHeroes).toHaveBeenCalledTimes(1);
    });

    it('should set heros correctly from the service', () => {
      mockHeroService.getHeroes.and.returnValue(of(HEROES));

      fixture.detectChanges();

      expect(fixture.componentInstance.heroes).toEqual(HEROES);
    });

    it('should create one li for each hero', () => {
      mockHeroService.getHeroes.and.returnValue(of(HEROES));

      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('ul.heroes li')).length).toBe(HEROES.length);
    });

    it('should render each hero as HeroComponent', () => {
      mockHeroService.getHeroes.and.returnValue(of(HEROES));

      // run ngOnInit()
      fixture.detectChanges();

      const heroComponentElements = fixture.debugElement.queryAll(By.directive(HeroComponent));
      expect(heroComponentElements.length).toBe(HEROES.length);
      for (let i = 0, len = heroComponentElements.length; i < len; i++) {
        expect(heroComponentElements[i].componentInstance.hero).toEqual(HEROES[i]);
      }
    });
  });

  describe('add', () => {
    it('should add a new hero to the hero list when the add button is clicked', () => {
      mockHeroService.getHeroes.and.returnValue(of(HEROES));
      fixture.detectChanges();

      const name = 'Mr.Ice';
      mockHeroService.addHero.and.returnValue(of({ id: 5, name, strength: 4 }));
      const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

      inputElement.value = name;
      addButton.triggerEventHandler('click', null);
      fixture.detectChanges();

      const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
      expect(heroText).toContain(name);
    });
  });
  describe('delete', () => {
    it(`should call heroService.deleteHero when the Hero Component's
      delete button is clicked`, () => {
      spyOn(fixture.componentInstance, 'delete');
      mockHeroService.getHeroes.and.returnValue(of(HEROES));

      fixture.detectChanges();

      const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
      //      for (let i = 0; i < heroComponents.length; i++) {
      heroComponents[0].query(By.css('button'))
        .triggerEventHandler('click', { stopPropagation: () => { } });

      expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);

      (<HeroComponent>heroComponents[1].componentInstance).delete.emit();

      heroComponents[2].triggerEventHandler('delete', null);
      expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[1]);
      //      }
    });

    it('should delete hero from the list', () => {
      // Arrange
      mockHeroService.deleteHero.and.returnValue(of(true));
      fixture.componentInstance.heroes = HEROES;
      // Act
      fixture.componentInstance.delete(HEROES[2]);
      // Assert
      expect(fixture.componentInstance.heroes.length).toEqual(2);
    });

    it('should call heroService with selected hero', () => {
      // Arrange
      mockHeroService.deleteHero.and.returnValue(of(true));
      fixture.componentInstance.heroes = HEROES;
      // Act
      fixture.componentInstance.delete(HEROES[2]);
      // Assert
      expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
    });
  });

  it('should have the correct route for the first hero', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

    const routerLink = heroComponents[0]
      .query(By.directive(RouterLinkDirectiveStub))
      .injector.get(RouterLinkDirectiveStub);

    heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

    expect(routerLink.navigatedTo).toBe('/detail/1');
  });
});
