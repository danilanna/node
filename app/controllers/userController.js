export const findUsers = (req, res) => {
    let users = [{name: 'a'}, {name: 'b'}, {name: 'c'}];

	res.json(users);
};