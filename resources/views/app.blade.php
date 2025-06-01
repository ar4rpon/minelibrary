<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>
    
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    <script> 
    // 設定が反映されないので暫定対応
    // Ziggyオブジェクトが存在する場合、absoluteプロパティをfalseに設定
    if (typeof Ziggy !== 'undefined') {
        Ziggy.absolute = false;
        
        // 元のroute関数を保存
        const originalRoute = route;
        
        // route関数をオーバーライド
        window.route = function(name, params, absolute) {
            // 第3引数が明示的に指定されていない場合は常にfalseを使用
            if (absolute === undefined) {
                absolute = false;
            }
            return originalRoute(name, params, absolute);
        };
    }
    </script>
    @viteReactRefresh
    @vite(['resources/ts/app.tsx'])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>