import { describe, expect, test } from 'bun:test';
import { exerciseThumbnail } from './exerciseMedia';
import curlBarra from '../assets/exercises/curl-biceps-barra.gif.asset.json';
import curlMartillo from '../assets/exercises/curl-martillo.gif.asset.json';

describe('Original exercise library media', () => {
  test('barbell curl uses its verified supplied GIF', () => {
    expect(exerciseThumbnail('45beb8da-ff9a-4dab-a209-1256c9ed55e3', 'old-photo.jpg')).toBe(`https://metodojafn.com${curlBarra.url}`);
  });
  test('hammer curl uses its verified supplied GIF', () => {
    expect(exerciseThumbnail('dcf4be9a-3166-4cd0-88a7-624eb6d298b1', 'old-photo.jpg')).toBe(`https://metodojafn.com${curlMartillo.url}`);
  });
  test('unmatched exercises never receive an unrelated GIF', () => {
    expect(exerciseThumbnail('unknown-shoulder-exercise', 'existing.jpg')).toBe('existing.jpg');
    expect(exerciseThumbnail(undefined, null)).toBeNull();
  });
});