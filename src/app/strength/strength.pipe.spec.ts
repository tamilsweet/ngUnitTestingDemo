import { StrengthPipe } from './strength.pipe';

describe('StrengthPipe', () => {

  it('should display weak if strength is 5', () => {
    // Arrange
    const pipe = new StrengthPipe();
    // Act
    const value = pipe.transform(5);
    // Assert
    expect(value).toEqual('5 (weak)');
  });

  it('should display strong if strength is 15', () => {
    // Arrange
    const pipe = new StrengthPipe();
    // Act
    const value = pipe.transform(15);
    // Assert
    expect(value).toEqual('15 (strong)');
  });

  it('should display unbelievable if strength is 25', () => {
    // Arrange
    const pipe = new StrengthPipe();
    // Act
    const value = pipe.transform(25);
    // Assert
    expect(value).toEqual('25 (unbelievable)');
  });
});
