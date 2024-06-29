import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:hive/hive.dart';
import 'package:running/pages/login.dart';

class Upload extends StatefulWidget {
  const Upload({
    super.key,
    required this.path,
  });

  final String path;

  @override
  State<Upload> createState() => _UploadState();
}

class _UploadState extends State<Upload> {
  late String filename;
  bool isLoading = false;
  String error = '';

  bool loggedIn = false;
  String username = '';

  void _checkLogin() {
    var box = Hive.box('auth');
    final sessionToken = box.get('session');
    if (sessionToken == null) {
      return;
    }
    setState(() {
      loggedIn = true;
      username = box.get('username');
    });
  }

  @override
  void initState() {
    super.initState();
    _checkLogin();
    filename = widget.path.split('/').last;
  }

  void _uploadFile(String path) async {
    setState(() {
      isLoading = true;
    });

    final box = Hive.box('auth');
    final sessionToken = box.get("session");
    final dio = Dio();
    if (sessionToken != null) {
      dio.options.headers['Authorization'] = sessionToken;
    }
    final formData = FormData.fromMap({
      'file':
          await MultipartFile.fromFile(path, filename: path.split('/').last),
    });
    final response =
        await dio.post('https://run.yong.ee/api/uploadGpx', data: formData);

    print(response);

    setState(() {
      isLoading = false;
    });
  }

  void _logout() async {
    final box = Hive.box('auth');
    final sessionToken = box.get("session");
    final dio = Dio();
    if (sessionToken != null) {
      dio.options.headers['Authorization'] = sessionToken;
    }
    await dio.post('https://run.yong.ee/api/logout');

    box.delete('session');
    box.delete('user_id');
    box.delete('username');
    setState(() {
      loggedIn = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: SafeArea(
      child: Center(
          child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (loggedIn) Text('Logged in as $username'),
          const SizedBox(height: 12),
          if (loggedIn)
            ElevatedButton(
                onPressed: () {
                  _logout();
                },
                child: const Text("Log Out")),
          if (loggedIn) const SizedBox(height: 120),
          const Text(
            "Uploading",
            style: TextStyle(fontSize: 20),
          ),
          Text(filename),
          Text(
            error,
            style: const TextStyle(color: Colors.redAccent),
          ),
          const SizedBox(
            height: 2,
          ),
          loggedIn
              ? (isLoading
                  ? const Text("Loading")
                  : ElevatedButton(
                      onPressed: () {
                        _uploadFile(widget.path);
                      },
                      child: const Text("Upload")))
              : ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => Login(
                                  afterLogin: _checkLogin,
                                )));
                  },
                  child: const Text("Log In")),
        ],
      )),
    ));
  }
}
