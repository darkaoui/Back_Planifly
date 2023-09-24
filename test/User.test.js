import { getUserById } from '../controllers/userController'

import User from '../models/userModel'
jest.mock('../models/userModel');

describe('getUserById', () => {
  it('return an existing user', async () => {
    const mockUser = { email: 'pilote@mail.com', firstname: 'John' };
    User.findById.mockResolvedValue(mockUser);

    const req = { params: { id: 'ObjectId("64e7163a8fae8cee77dd7006")' } };
    const res = {
      json: jest.fn(),
      status: jest.fn(),
    };

    await getUserById(req, res);

    expect(User.findById).toHaveBeenCalledWith('ObjectId("64e7163a8fae8cee77dd7006")');
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  
});
