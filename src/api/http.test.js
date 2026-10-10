import { describe, expect, it } from 'vitest';
import { apiErrorDetails, unwrap } from './http.js';

describe('API response normalization', () => {
  it('unwraps the backend ApiResponse data field', () => {
    expect(unwrap({ data: { videos: [] }, message: 'ok' })).toEqual({ videos: [] });
  });

  it('preserves backend responses without a data field', () => {
    expect(unwrap({ user: { _id: '1' }, message: 'current user details' })).toEqual({ user: { _id: '1' }, message: 'current user details' });
  });

  it('normalizes backend field validation errors', () => {
    expect(apiErrorDetails({ response: { status: 400, data: { message: 'Please correct the highlighted fields', errors: [{ path: 'username', msg: 'Username is invalid' }] } } })).toEqual({
      message: 'Please correct the highlighted fields.',
      fieldErrors: { username: 'Username is invalid' },
      status: 400,
    });
  });
});
