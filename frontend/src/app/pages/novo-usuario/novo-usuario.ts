import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-novo-usuario",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./novo-usuario.html",
  styleUrl: "./novo-usuario.css",
})
export class NovoUsuarioComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isLoading = false;
  successMessage = "";
  errorMessage = "";
  mfaSecret = "";
  mfaQrCode = "";
  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.form = this.formBuilder.group(
      {
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  private passwordMatchValidator(
    group: AbstractControl,
  ): { [key: string]: boolean } | null {
    const password = group.get("password")?.value;
    const confirmPassword = group.get("confirmPassword")?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.errorMessage = "Por favor, corrija os erros no formulário";
      return;
    }

    this.isLoading = true;
    this.errorMessage = "";
    this.successMessage = "";

    const { email, password } = this.form.value;

    this.authService
      .register(email, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage =
            response.message || "Usuário criado com sucesso!";

          // Se houver secret MFA retornado, armazenar e exibir
          if (response.secret) {
            this.mfaSecret = response.secret;
            // Se a resposta incluir otpauth_url, gerar QR code
            if (response.otpauth_url) {
              this.generateQrCode(response.otpauth_url);
            }
          }

          // Limpar formulário após sucesso
          setTimeout(() => {
            this.form.reset();
            this.successMessage = "";
          }, 3000);
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 409) {
            this.errorMessage = "Este email já está registrado";
          } else if (error.error?.error) {
            this.errorMessage = error.error.error;
          } else {
            this.errorMessage = "Erro ao criar usuário. Tente novamente.";
          }
        },
      });
  }

  private generateQrCode(otpauthUrl: string): void {
    // Usar a API do Google Charts para gerar QR code
    const encodedUrl = encodeURIComponent(otpauthUrl);
    this.mfaQrCode = `https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${encodedUrl}`;
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.successMessage = "Código copiado para a área de transferência!";
      setTimeout(() => {
        this.successMessage = "";
      }, 2000);
    });
  }
}
