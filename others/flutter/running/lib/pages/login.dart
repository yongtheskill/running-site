import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:hive/hive.dart';

class Login extends StatefulWidget {
  const Login({super.key, required this.afterLogin});
  final Function afterLogin;

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  late TextEditingController _usernameController;
  late TextEditingController _passwordController;
  String errorText = '';

  @override
  void initState() {
    super.initState();
    _usernameController = TextEditingController();
    _passwordController = TextEditingController();
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _login() async {
    final username = _usernameController.value.text;
    final password = _passwordController.value.text;

    final dio = Dio();
    final response = await dio.post('https://run.yong.ee/api/login',
        data: {'username': username, 'password': password});
    if ((response.statusCode ?? 402) < 400) {
      final success = response.data['success'];
      if (!success) {
        setState(() {
          errorText = response.data['error'] ?? 'error logging in';
        });
        return;
      }

      final box = Hive.box('auth');
      box.put('session', response.data['token']);
      box.put('user_id', response.data['id']);
      box.put('username', response.data['username']);

      widget.afterLogin();
      if (!mounted) return;
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: SafeArea(
      child: Center(
          child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            "Log In",
            style: TextStyle(fontSize: 20),
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: MediaQuery.of(context).size.width * 0.7,
            child: TextField(
              controller: _usernameController,
              obscureText: false,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Username',
              ),
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: MediaQuery.of(context).size.width * 0.7,
            child: TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Password',
              ),
            ),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
              onPressed: () {
                _login();
              },
              child: const Text("Log In")),
          Text(
            errorText,
            style: const TextStyle(color: Colors.red),
          ),
        ],
      )),
    ));
  }
}
