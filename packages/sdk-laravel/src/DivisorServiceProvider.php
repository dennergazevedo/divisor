<?php

declare(strict_types=1);

namespace Divisor;

use Illuminate\Support\ServiceProvider as BaseServiceProvider;

class DivisorServiceProvider extends BaseServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__ . '/../config/divisor.php' => config_path('divisor.php'),
            ], 'divisor-config');
        }
    }
}
