export class UserDTO {
  constructor(user) {
    this._id = user._id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.age = user.age;
    this.role = user.role;
  }
}

/**
 * funsion para convertir usuario a dto
 * @param {Object} user - usuario de la bd
 * @returns {UserDTO} usuario sin info sensible
 */
export function userToDTO(user) {
  return new UserDTO(user);
}
