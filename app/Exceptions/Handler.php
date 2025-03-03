<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Inertia\Inertia;
use Throwable;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });

        // 404エラーのハンドリング
        $this->renderable(function (NotFoundHttpException $e) {
            return Inertia::render('features/error/pages/NotFound')
                ->toResponse(request())
                ->setStatusCode(404);
        });

        // その他のエラーのハンドリング（500エラーなど）
        $this->renderable(function (Throwable $e) {
            if (config('app.debug')) {
                // デバッグモードの場合は、デフォルトのエラーページを表示
                return null;
            }

            return Inertia::render('features/error/pages/ServerError')
                ->toResponse(request())
                ->setStatusCode(500);
        });
    }
}
